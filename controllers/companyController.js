const jwt = require('jsonwebtoken');
const pbkdf2 = require('pbkdf2');

const Company = require ('../models/companyModel');

exports.Signup = async (req,res) => {
    try{
        // if the fields of first name, email address or password are left empty, return an error
        if(!req.body.businessName || !req.body.businessEmailAddress || !req.body.password){
            throw new Error('Required information is not provided');
        }

        // create a document in Database with the provided information from front-end
        const query = Company.create({
            businessName: req.body.businessName,
            businessEmailAddress: req.body.businessEmailAddress,
            businessMail: req.body.businessMail,
            businessPhoneNumber: req.body.businessPhoneNumber,
            repName: req.body.repName,
            password: pbkdf2.pbkdf2Sync(req.body.password, 'transparency-secret', 1, 32, 'sha512')
        })
        let Signup = await query;
        
        // generating token for authorization
        const token = jwt.sign({id: Signup._id}, 'transparency-secret');

        res.status(201).json({status: 201, message: 'success', token: token, data: Signup});

    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}