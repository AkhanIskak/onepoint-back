import express from 'express';
import EnrollmentModel from '../models/enrollment.mjs';
import UserModel from '../models/user.mjs';
import EventModel from '../models/event.mjs';
import pdf from 'html-pdf';

const router = express.Router();

router.use(async (req, res, next) => {
    const authToken = req.header('Auth');

    if (!authToken || !(await UserModel.exists({email: authToken}))) {
        res.status(401).send();
        return;
    }

    next();
});

router.get('/enrollment', async (req, res) => {
    const {_id} = await UserModel.findOne({email: req.header('Auth')});

    const enrollments = await EnrollmentModel.find({participantId: _id})

    res.status(200).send(enrollments);
});

router.post('/enrollment/:id/complete', async (req, res) => {
    //check if current user is actually creator of event;
    const enrollment = await EnrollmentModel.findById(req.params.id);
    const event = await EventModel.findById(enrollment.eventId);

    if (event.createdBy !== req.header('Auth')) {
        res.status(403).json({
            message: 'Пользователь не является создателем события!'
        });

        return;
    }

    enrollment.isCompleted = true;
    enrollment.comment = req.body.comment;

    const user = await UserModel.findById(enrollment.participantId)

    //TODO: reputation history
    user.reputation = user.reputation + 30;
    user.save()

    enrollment.update();

    res.status(200).send(enrollment._id);
});

router.post('/enrollment/:id/certificate', async (req, res) => {
    const enrollmentId = req.params.id;

    if (!enrollmentId) {
        res.status(400).send({
            message: 'Не указан enrollmentId'
        });
    }

    const enrollment = await EnrollmentModel.findOne({_id: enrollmentId});

    if (!enrollment.isCompleted) {
        res.status(500).send({
            message: 'Вы не посещали событие!'
        });

        return;
    }

    const [user, event] = await Promise.all([UserModel.findById(enrollment.participantId), EventModel.findById(enrollment.eventId)]);

    const enrollmentObject = enrollment.toObject();
    const userObject = user.toObject();
    const eventObject = event.toObject();

    enrollmentObject.participant = userObject;
    enrollmentObject.event = eventObject;

    // const processedHtml = processString(html, enrollmentObject);

    const html = `<html> <head> <style type=\'text/css\'> body, html{ margin: 0; padding: 0;}body{color: black; display: table; font-family: Georgia, serif; font-size: 24px; text-align: center;}.container{border: 20px solid tan; width: 750px; height: 563px; display: table-cell; vertical-align: middle;}.logo{color: tan;}.marquee{color: tan; font-size: 48px; margin: 20px;}.assignment{margin: 20px;}.person{border-bottom: 2px solid black; font-size: 32px; font-style: italic; margin: 20px auto; width: 400px;}.reason{margin: 20px;}</style> </head> <body> <div class="container"> <div class="logo"> Организатор: <b>${enrollmentObject.event.createdBy}</b> </div><div class="marquee"> Сертификат об участии </div><div class="assignment"> Данный сертификат присуждается человеку с именем </div><div class="person"> <b>${enrollmentObject.participant.name}</b> </div><div class="reason"> ${enrollmentObject.comment} </div></div></body></html>`;

    pdf.create(html, {format: 'Letter', orientation: 'landscape'}).toBuffer(function (err, buffer) {
        if (err) {
            res.status(500).send({
                message: 'Ошибка при создании сертификата!'
            });
        }

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=certificate.pdf',
            'Content-Length': buffer.length
        });
        res.end(buffer);
    });
});

function processString(template, valueObject) {
    return template.replaceAll(
        /(?<=\[).+?(?=\])/, //{value}
        placeholderWithoutDelimiters => path(valueObject, placeholderWithoutDelimiters)
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