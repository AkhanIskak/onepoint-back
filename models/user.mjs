import mongoose from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    reputation: {type: Number, required: true, default: 0},
    password: String
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;