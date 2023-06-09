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

        res.status(201).json({status: 201, message: 'success', token: token, data: Login});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}
