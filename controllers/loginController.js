const jwt = require('jsonwebtoken');
const pbkdf2 = require('pbkdf2');

const User = require ('../models/userModel');
const Company = require('../models/companyModel');


exports.Login = async (req,res) => {
    try{

        // if email or password fields are empty, return an error
        if(!req.body.emailAddress || !req.body.password){
            throw new Error('Required information is not provided');
        }

        // checking from the database whether the a document is present with the entered email and password
        let Login, query;
        if (req.body.entity === 'user'){
            query = User.findOne({
                emailAddress: req.body.emailAddress,
                password: pbkdf2.pbkdf2Sync(req.body.password, 'transparency-secret', 1, 32, 'sha512')
            }).select('-password')
            Login = await query;
        }
        else if (req.body.entity === 'company'){
            query = Company.findOne({
                businessEmailAddress: req.body.emailAddress,
                password: pbkdf2.pbkdf2Sync(req.body.password, 'transparency-secret', 1, 32, 'sha512')
            }).select('-password')
            Login = await query;
        }
        
        // if email address does not match with the password, return an error
        if (Login === null){
            throw new Error ('Wrong Email or Password');
        }

        // generating token for authorization
        const token = jwt.sign({id: Login._id}, 'transparency-secret');

        let brand = ["Audi", "Chevrolet", "Cadillac", "Acura", "BMW", "Chrysler", "Ford", "Buick", "INFINITI", "GMC", "Honda", "Hyundai", "Jeep", "Genesis", "Dodge", "Jaguar", "Kia", "Land Rover", "Lexus", "Mercedes-Benz", "Mitsubishi", "Lincoln", "MAZDA", "Nissan", "MINI", "Porsche", "Ram", "Subaru", "Toyota", "Volkswagen", "Volvo", "Alfa Romeo", "FIAT", "Freightliner", "Maserati", "Tesla", "Aston Martin", "Bentley", "Ferrari", "Lamborghini", "Lotus", "McLaren", "Rolls-Royce", "smart", "Scion", "SRT", "Suzuki", "Fisker", "Maybach", "Mercury", "Saab", "HUMMER", "Pontiac", "Saturn", "Isuzu", "Panoz", "Oldsmobile", "Daewoo", "Plymouth", "Eagle", "Geo", "Daihatsu", "Polestar", "Rivian"];
        // This sorting is done because the list item "smart" was placed at the end because the sort is case sensitive
        brand.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        res.status(201).json({status: 201, message: 'success', token: token, entity: req.body.entity, brand: brand, data: Login});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}
