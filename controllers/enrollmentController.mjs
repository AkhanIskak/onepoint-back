import express from 'express';
import EnrollmentModel from '../models/enrollment.mjs';
import UserModel from '../models/user.mjs';
import EventModel from '../models/event.mjs';
import pdf from 'html-pdf';

const router = express.Router();

router.use(async (req, res, next) => {
    const user = await EventModel.find({email: req.cookies.auth})

    if (!user) {
        res.status(401).send();
        return;
    }

    next();
});

router.get('/enrollment', async (req, res) => {
    const {_id} = await UserModel.findOne({email: req.cookies.email});

    const enrollments = await EnrollmentModel.find({participantId: _id})

    res.status(200).send(enrollments);
});

router.post('/enrollment/:id/complete', async (req, res) => {
    //check if current user is actually creator of event;
    const enrollment = await EventModel.findById(req.params.id);
    const event = await EventModel.findById(enrollment.eventId);

    if (event.createdBy !== req.cookies.auth) {
        res.status(403).json({
            message: 'Пользователь не является создателем события!'
        });

        return;
    }

    enrollment.isCompleted = true;
    enrollment.comment = req.body.comment;

    enrollment.update();

    res.status(200).send(enrollment._id);
});

router.post('/enrollment/:id/certificate', async (req, res) => {
    const html = 'Participant: <b>${participant.email}</b>';

    const enrollmentId = req.params.id;

    if (!enrollmentId) {
        res.status(400).send({
            message: 'Не указан enrollmentId'
        });
    }

    const enrollment = await EventModel.findOne({_id: enrollmentId});

    const enrollmentUser = await UserModel.findById(enrollment.participantId);
    const enrollmentEvent = await EventModel.findById(enrollment.eventId);

    enrollment.participant = enrollmentUser;
    enrollment.event = enrollmentEvent;

    const processedHtml = processString(html, enrollment);

    pdf.create(processedHtml).toBuffer(function (err, buffer) {
        if (err) {
            res.status(500).send({
                message: 'Ошибка при создании сертификата!'
            });
        }

        res.send(buffer);
    });
});

function processString(template, valueObject) {
    return template.replace(
        /{\w+}/g, //{value}
        placeholderWithDelimiters => {
            const placeholderWithoutDelimiters = placeholderWithDelimiters.substring(1, placeholderWithDelimiters.length - 1);

            return path(valueObject, placeholderWithoutDelimiters);
        },
    );
}

function path(obj, path) {
    let targetValue = obj;

    for (const pathElement of path.split('.')) {
        if (targetValue) {
            targetValue = targetValue[pathElement];
        } else {
            return undefined;
        }
    }
}

export default router;