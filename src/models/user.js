const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoles = ['admin', 'employee', 'costumer'];

const userSchema = new Schema({
    email: {type: String, match: /^\S+@\S+\.\S+$/, required: true, unique: true, trim: true, lowercase: true},
    name: {type: String, required: true},
    phoneNumber: {type: String, unique: true, maxlength: 11}, //must be required for costumer
    password: {type: String, required: true, minlength: 6},
    role: {type: String, enum: userRoles, default: 'costumer', required: true},
    //for employee
    store: {type: Schema.Types.ObjectId, ref: 'Store'},
    //for costumer
    photo: {type: String/*Schema.Types.Mixed*/}
    //maybe only PicPay account maybe link for payment is better

});

userSchema.path('email').set(function (email) {
    if (!this.name)
        this.name = email.replace(/^(.+)@.+$/, '$1');
    return email;
});

userSchema.pre('save', function (next) {
    console.log('this.isModified(\'password\'-) ' + this.isModified('password'));
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 9).then((hash) => {
        this.password = hash;
        next();
    }).catch(next);
});

userSchema.methods = {
    authenticate(password) {
        return bcrypt.compare(password, this.password).then((valid) => valid ? this : false);
    }
};

userSchema.statics = {
    userRoles
};


module.exports = mongoose.model('User', userSchema);