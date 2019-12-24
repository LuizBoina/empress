const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const User = require('../../models/user/model');

const userResolver = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({$or: [
                    {email: args.userInput.email},
                    {phoneNumber: args.userInput.phoneNumber}
                ]})
            if (existingUser)
                throw new Error('User exists already');
            else {
                const result = await User.create(args.userInput);
                return { ...result._doc, password: null, _id: result.id };
            }
        } catch (err) {
            throw err;
        }
    },
    login: async args => {

    }
};

module.exports = userResolver;