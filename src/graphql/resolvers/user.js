const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const userResolver = {
    createUser: async args => {
        try {
            if (/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i.test(args.userInput.email))
                throw new Error('Email inválido');
            else if (args.userInput.role === 'costumer' && (args.userInput.phoneNumber === "" || args.userInput.phoneNumber !== 11))
                throw new Error('Número de telefone inválido');
            else if (args.userInput.password.length < 6)
                throw new Error('A senha deve ter pelo menos 6 dígitos');
            const existingUser = await User.findOne({
                $or: [
                    {email: args.userInput.email},
                    {phoneNumber: args.userInput.phoneNumber}
                ]
            });
            if (existingUser) {
                if (existingUser.email === args.userInput.email)
                    throw new Error('Email já registrado');
                else
                    throw new Error('Número de telefone já registrado');
            } else {
                const result = await User.create(args.userInput);
                return {...result._doc, password: null, _id: result.id};
            }
        } catch (err) {
            throw err;
        }
    },
    login: async ({userName, password}) => {
        let user;
        if (parseInt(userName, 10))
            user = await User.findOne({phoneNumber: userName});
        else
            user = await User.findOne({email: userName});
        if (!user)
            throw new Error('Usuário não cadastrado');
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Senha incorreta');
        }
        const token = jwt.sign({userId: user.id},
            'senhaSecreta', //make it better
            {expiresIn: '12h'});
        return {userId: user.id, role: user.role, token: token, tokenExpiration: 12};
    },
    logout: () => {
        return {userId: null, token: null};
    },
};

module.exports = userResolver;