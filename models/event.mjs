import mongoose from 'mongoose';

const {Schema} = mongoose;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    logo: {
        data: Buffer,
        contentType: String
    }, //base64
    attachments: [{
        base64: {type: String, required: true},
        date: {type: Date, default: Date.now}
    }],
    comments: [{
        creator: {type: String, required: true},
        body: {type: String, required: true},
        date: {type: Date, default: Date.now}
    }],
    dateStart: {type: Date, required: true},
    dateEnd: {type: Date, required: true},
    createTs: {type: Date, required: true, default: Date.now},
    createdBy: {type: String, required: true},
    priority: {type: Number, default: 0},
    viewCount: {type: Number, default: 0},
    location: String
});

const EventModel = mongoose.model('Events', eventSchema);

export default EventModel;