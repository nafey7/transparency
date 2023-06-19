const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const carSchema = new Schema({

    description: {
        type: String
    },
    themes: {
        type: Array
    },
    image: {
        type: String
    },
    name: {
        type: String
    },
    mileage: {
        type: String
    },
    price: {
        type: String
    },
    location: {
        type: String
    },
    contact: {
        type: String
    },
    warrantyCoverage: {
        type: String
    },
    vehicleInspection: {
        type: String
    },
    previousOwners: {
        type: String
    },
    ownerID: {
        type: String
    }
    
},
 {
    timestamps: true
}

);

const Car = mongoose.model('Car', carSchema);
module.exports = Car;