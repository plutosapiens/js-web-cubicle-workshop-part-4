const mongoose = require('mongoose');
const brcypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'Username is required!'],
        minLength: [5, "Too short!"],
        match: [/^[A-Za-z0-9]+$/, 'Invalid characters!'],
        unique: {
            value: true,
            message: 'Username already exists!'
        },
    },
    password:{
        type: String,
        minLength: [8, 'Password is too short!'],
        validate: {
            validator: function(value) {
                return /^[A-Za-z0-9]+$/.test(value);
            },
            message: 'Invalid characters!'
        },
    },
});


userSchema.virtual('repeatPassword').set(function(value) {
    if(value !== this.password) {
        throw new mongoose.MongooseError('Password missmatch! From model');
    }
})

userSchema.path('username').validate(function (username) {
    const user = mongoose.model('User').findOne({ username });
    return !!user;
}, 'Username already exists!');

userSchema.pre('save', async function () {
    //                             word,           salt rounds
    const hash = await brcypt.hash(this.password, 10);
    this.password = hash;
})
const User = mongoose.model('User', userSchema);

module.exports = User;