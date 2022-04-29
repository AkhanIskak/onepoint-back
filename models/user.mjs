import mongoose from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema({
    surnameName: String,
    email: String,
    reputation: {required:false,type:Number},
    password: String
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;