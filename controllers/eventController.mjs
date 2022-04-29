import express from 'express';
import EventModel from "../models/event.mjs";

const router = express.Router();
router.use(async (req, res, next) => {
    const user = await EventModel.find({email: req.cookies.auth})
    if (!user) {
        res.status(500).json({message: "User is not logged in , please relogin"})
        return;
    }
    next();
});
router.get('/', async (req, res) => {

    const events = await EventModel.find().limit(req.query.limit).skip(req.query.offset);
    res.status(200).json(events);
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

    res.status(200).json(updatedEvent);
});

router.post('/', async (req, res) => {
    const body = req.body;

    const event = new EventModel(body);

    const savedEvent = await event.save();
    res.status(200).json({
        id: savedEvent._id.toString()
    })

});


export default router;