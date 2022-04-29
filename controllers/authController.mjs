import express from 'express';
import UserModel from '../models/user.mjs';

const router = express.Router();

router.post('/auth/register', async (req, res) => {
    try {
        await UserModel.create(req.body);
        res.status(200).send({
            message: 'User successfully created'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
});

router.post('/auth/login', async (req, res) => {
    const user = await UserModel.findOne(req.body);
    if (user) {
        //jwt token
        res.writeHead(200, {
            'Set-Cookie': `auth=${req.body.email}`,
            'Content-Type': 'text/plain'
        });

    } else {
        res.sendStatus(401);
    }
});

export default router;
