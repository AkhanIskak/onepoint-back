import express from 'express';
import EventModel from "../models/event.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    const userEmail = req.query?.userEmail;

    let events;
    if (userEmail) {
        events = await EventModel.find({'createdBy': userEmail});
    } else {
        events = await EventModel.find({});
    }

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

    await EventModel.findByIdAndUpdate(id, event);
    await EventModel.save();

    res.status(200).send(event._id.toString());
});

router.post('/', async (req, res) => {
    const body = req.body;

    const event = new EventModel(body);

    const savedEvent = await event.save();

    return savedEvent._id.toString();
});


export default router;