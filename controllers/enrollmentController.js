import express from 'express';
import EnrollmentModel from "../models/enrollment";
import User from "../models/user.mjs";
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
router.patch("/:id",async (req, res) => {
    //check if current user is actually creator of event;
    const {_id} = await User.findOne({email: req.cookies.auth});
    const event = await EventModel.findById(req.params.id);
    if(event._id!==_id){
        res.status(401).json({
            message:"This user is not creator of event, and cant enroll participants"
        })
        return;
    }
    await EnrollmentModel.updateOne({eventId:event.id,participantId:_id},{isCompleted:true,comment:req.body.comment})
    res.status(200).json({
        message:"Enrollment is DONE!! :)"
    })
})