import express from 'express';
import EventModel from "../models/event.mjs";
import UserModel from "../models/user.mjs";
import EnrollmentModel from "../models/enrollment.mjs";

const router = express.Router();

router.use(async (req, res, next) => {
    const user = await EventModel.find({email: req.cookies.auth})

    if (!user) {
        res.status(401).send();
        return;
    }

    next();
});

router.get('/', async (req, res) => {
    const events = await EventModel.find({});

    res.status(200).send(events);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const event = await EventModel.findById(id);

    res.status(200).send(event);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const event = req.body;

    const updatedEvent = await EventModel.findByIdAndUpdate(id, event);

    res.status(200).send(updatedEvent._id);
});

router.post('/', async (req, res) => {
    const body = req.body;

    const event = new EventModel(body);

    const savedEvent = await event.save();

    res.status(200).send(savedEvent._id);
});

router.post('/enroll/:eventId', async (req, res) => {
    const {_id} = await UserModel.findOne({email: req.cookies.email});

    const enrollment = await EnrollmentModel.create({
        participantId: _id,
        eventId: req.params.eventId,
    });

    res.status(200).send(enrollment._id);
});

export default router;