import mongoose from 'mongoose';
import {ObjectId} from "mongodb";

const {Schema} = mongoose;

const enrollmentSchema = new Schema({
    participantId: {required: true, type: ObjectId},
    eventId: {required: true, type: ObjectId},
    isCompleted: {required: true, type: Boolean, default: false},
    comment: {required: false, type: String},
    certificate: {required: false, type: String},
});

const EnrollmentModel = mongoose.model('Enrollments', enrollmentSchema);

export default EnrollmentModel