import User from '/models/user.mjs';
export class UserService{
    static async getUser(query) {
        const user =  await User.findOne(query);
        return user;
    }

}