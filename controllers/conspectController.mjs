import express from 'express';
import ConspectModel from "../models/conspect.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
    const userEmail = req.query?.userEmail;

    let conspects;
    if (userEmail) {
        conspects = await ConspectModel.find({'createdBy': userEmail});
    } else {
        conspects = await ConspectModel.find({});
    }

    res.status(200).send(conspects);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const conspect = await ConspectModel.findById(id);

    res.status(200).send(conspect);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const conspect = req.body;

    await ConspectModel.findByIdAndUpdate(id, conspect);
    await ConspectModel.save();

    res.status(200).send(conspect._id.toString());
});

router.post('/', async (req, res) => {
    const body = req.body;

    const conspect = new ConspectModel(body);

    const savedConspect = await conspect.save();

    return savedConspect._id.toString();
});


export default router;