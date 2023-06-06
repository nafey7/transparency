const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect the routes for users
exports.Protect = async (req,res, next) => {
    try{
        let token;

        // Check whether token is present in request or not
        if (!req.body.token){
            throw new Error ('Token is not present');
        }
        token = req.body.token
        // Verifiy the token (Extract user Identity from token)
        const match = await jwt.verify (token, 'transparency-secret');
        const userID = match.id;
        
        // Find user of that particular ID
        const query = User.findById(userID);
        const UserFound = await query;

        // If no user with the particular Identity is present in the database, return Error in response
        if (!UserFound){
            throw new Error ('No such user exists');
        }

        req.body.userID = userID;

        next();

    }
    catch(err){
        console.log(err);
        res.status(401).json({status: '401', message: 'fail', data: err.message});
    }
}