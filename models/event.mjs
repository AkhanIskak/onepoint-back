import mongoose from 'mongoose';

const {Schema} = mongoose;

const eventSchema = new Schema({
    name: String,
    creator:String,//email of creator,
    description:String,
    date:String,
    place:String,
    comments:String,
    viewCount:Number,
    priority:Number
},{
    timestamps: { createdAt: true, updatedAt: false }
});

const EventModel = mongoose.model('Events', eventSchema);

export default EventModel;