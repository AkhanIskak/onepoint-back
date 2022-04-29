import express from 'express';
import UserModel from '../models/user.mjs';

const router = express.Router();

router.post('/auth/register', async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
});

router.post('/auth/login', async (req, res) => {
    const user = await UserModel.findOne(req.body)
    if (user) {
        res.status(200).send(user);
    } else {
        res.sendStatus(401);
    }
});

export default router;
