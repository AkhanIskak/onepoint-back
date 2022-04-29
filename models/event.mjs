import mongoose from 'mongoose';

const {Schema} = mongoose;

const eventSchema = new Schema({
    name: String,
    attachments: [{base64: String, date: {type: Date, default: Date.now}}],
    createTs: {type: Date, default: Date.now},
    comments: [{creator: String, body: String, date: Date}],
    createdBy: String,
    rating: Number,
    location:String
});

const EventModel = mongoose.model('Conspect', eventSchema);

export default EventModel;