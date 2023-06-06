const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const userSchema = new Schema({

    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },
    emailAddress: {
        type: String,
        unique: [true, 'Account with this email is already registered'],
        validate: [validator.isEmail, 'Please enter a valid Email Address']
    }
    
},
 {
    timestamps: true
}

);

const User = mongoose.model('User', userSchema);
module.exports = User;