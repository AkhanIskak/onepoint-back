import mongoose from 'mongoose';

const {Schema} = mongoose;

const enrollmentSchema = new Schema({
    participantId: {required: true, type: String},
    eventId: {required: true, type: String},
    isCompleted: {required: true, type: Boolean,default:false},
    comment: {required: false, type: String},
    certificate: {required: false, type: String},
})
const EnrollmentModel = mongoose.model('Enrollments', enrollmentSchema);

export default EnrollmentModel