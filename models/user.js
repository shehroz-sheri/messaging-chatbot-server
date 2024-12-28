const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required!'] },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Email is not valid']
    },
    password: { type: String, required: true, minLength: [6, 'Password must be at least 6 characters!'] },
    number: { type: String, required: [true, 'Phone Number is required!'], unique: true, minLength: [8, 'Phone Number must be at least 8 characters!'] },
    token: { type: String }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
