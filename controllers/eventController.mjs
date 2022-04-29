import express from 'express';
import EventModel from '../models/event.mjs';
import UserModel from '../models/user.mjs';
import EnrollmentModel from '../models/enrollment.mjs';
import fs from 'fs';
import * as path from 'path';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({storage: storage})

router.use(async (req, res, next) => {
    const user = await EventModel.find({email: req.cookies.auth})

    if (!user) {
        res.status(401).send();
        return;
    }

    next();
});

router.get('/event', async (req, res) => {
    const events = await EventModel.find({});

    res.status(200).send(events);
});

router.get('/event/:id', async (req, res) => {
    const id = req.params.id;

    const event = await EventModel.findById(id);

    res.status(200).send(event);
});

router.put('/event/:id', async (req, res) => {
    const id = req.params.id;
    const event = req.body;

    const updatedEvent = await EventModel.findByIdAndUpdate(id, event);

    res.status(200).send(updatedEvent._id);
});

router.post('/event/', upload.single('logo'), async (req, res) => {
    const body = req.body;

    const event = new EventModel(body);
    if (req.file) {
        event.logo = {
            data: await fs.promises.readFile(path.join(__dirname + '/event/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    const savedEvent = await event.save();

    res.status(200).send(savedEvent._id);
});

router.post('/event/enroll/:eventId', async (req, res) => {
    const {_id} = await UserModel.findOne({email: req.cookies.email});

    const enrollment = await EnrollmentModel.create({
        participantId: _id,
        eventId: req.params.eventId,
    });

    res.status(200).send(enrollment._id);
});

export default router;