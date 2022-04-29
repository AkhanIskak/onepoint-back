import mongoose from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema({
    surname:String,
    school:String,
    city:String,
    country:String,
    name: String,
    email:String,
    rating: Number
});

const User = mongoose.model('User', userSchema);

export default User;