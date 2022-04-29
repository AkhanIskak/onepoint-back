import express from "express";
import UserModel from '../models/user.mjs';

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        await UserModel.create(req.body);
        res.status(200).json({ 
            message: "User successfuly created"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
});

router.post("/login", async (req, res) => {
    const user = await UserModel.findOne(req.body);
    if (user) {
        //jwt token
        res.cookie("auth", req.body.email).status(200).json({message: "successfuy logged in"})

    } else res.status(401).json({message: "Wrong email or password"})
});

export default router;
