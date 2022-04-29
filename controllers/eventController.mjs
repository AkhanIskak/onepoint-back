import express from 'express';
import EventModel from "../models/event.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    const userEmail = req.query?.userEmail;

    let conspects;
    if (userEmail) {
        conspects = await EventModel.find({'createdBy': userEmail});
    } else {
        conspects = await EventModel.find({});
    }

    res.status(200).send(conspects);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const conspect = await EventModel.findById(id);

    res.status(200).send(conspect);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const conspect = req.body;

    await EventModel.findByIdAndUpdate(id, conspect);
    await EventModel.save();

    res.status(200).send(conspect._id.toString());
});

router.post('/', async (req, res) => {
    const body = req.body;

    const conspect = new EventModel(body);

    const savedConspect = await conspect.save();

    return savedConspect._id.toString();
});


export default router;