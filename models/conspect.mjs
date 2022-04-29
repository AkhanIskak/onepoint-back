import mongoose from 'mongoose';

const {Schema} = mongoose;

const conspectSchema = new Schema({
    name: String,
    attachments: [{base64: String, date: {type: Date, default: Date.now}}],
    createTs: {type: Date, default: Date.now},
    comments: [{body: String, date: Date}],
    createdBy: String,
    rating: Number
});

const ConspectModel = mongoose.model('Conspect', conspectSchema);

export default ConspectModel;