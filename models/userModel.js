const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const userSchema = new Schema({

    fullName: {
        type: String
    },
    emailAddress: {
        type: String,
        unique: [true, 'Account with this email is already registered'],
        validate: [validator.isEmail, 'Please enter a valid Email Address']
    },
    telephoneNumber: {
        type: String
    },
    nickName: {
        type: String
    },
    password: {
        type: String
    }
    
},
 {
    timestamps: true
}

);

const User = mongoose.model('User', userSchema);
module.exports = User;