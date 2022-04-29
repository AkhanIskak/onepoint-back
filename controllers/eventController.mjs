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

    await EventModel.findByIdAndUpdate(id, event);

    res.status(200).json(event._id.toString());
});

router.post('/', async (req, res) => {
    const body = req.body;

    const conspect = new EventModel(body);

    const savedConspect = await conspect.save();
    res.status(200).json({
        id: savedConspect._id.toString()
    })

});


export default router;