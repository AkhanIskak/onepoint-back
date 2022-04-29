import express from 'express';
import EnrollmentModel from "../models/enrollment";
import User from "../models/user.mjs";

const router = express.Router();
router.use(async (req, res, next) => {
    const user = await EventModel.find({email: req.cookies.auth})
    if (!user) {
        res.status(500).json({message: "User is not logged in , please relogin"})
        return;
    }
    next();
});
router.get("/", async (req, res) => {
    const enrollments = await EnrollmentModel.find({email: req.cookies.email})
    res.status(200).json(enrollments);
});
router.post("/:id", async (req, res) => {
    const {_id} = await User.findOne({email: req.cookies.email});
    await EnrollmentModel.create({
        participantId: _id,
        eventId: req.params.id,
    })
    res.status(200).json({
        message:"Enrollment created"
    })
});