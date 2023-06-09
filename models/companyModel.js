const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const companySchema = new Schema({

    businessName: {
        type: String
    },
    businessEmailAddress : {
        type: String,
        unique: [true, 'Account with this email is already registered'],
        validate: [validator.isEmail, 'Please enter a valid Email Address']
    },
    businessMail: {
        type: String
    },
    businessPhoneNumber: {
        type: String
    },
    repName: {
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

const Company = mongoose.model('Company', companySchema);
module.exports = Company;