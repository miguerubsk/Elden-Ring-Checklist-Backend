const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { isEmail } = require('validator');

const userSchema = new Schema ({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email:{
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    checklist: {
        type: Schema.Types.ObjectId,
        ref: 'Checklist'
    },
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, pass) {
    const user = await this.findOne({ email });

    if (user) {
        console.log(user);
        const auth = await bcrypt.compare(pass, user.pass);
        if (auth) {return user;}
    }
    throw Error('Email or Password incorrect.');
}

const User = mongoose.model("user", userSchema);
module.exports = User;