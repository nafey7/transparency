const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const userRoute = require('./routes/userRoute');
const companyRoute = require('./routes/companyRoute');
const loginRoute = require('./routes/loginRoute');
const sharedRoute = require('./routes/sharedRoute');

const app = express();

// Integration of Front-end React.js with our Back-end Express server
const whitelist = ['http://localhost:3000' , 'http://127.0.0.1:5173' ,'https://transparency-fe.vercel.app'];
const corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true} // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = {origin: false} // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

// Connect MongoDB with our application server
mongoose.connect(process.env.dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log("Sucessfully connected to Database"))
    .catch((err) => console.log(err));

// Initializing ChatGpt model
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
});
const openai = new OpenAIApi(configuration);

app.use(morgan('dev'));
app.use(express.json());

// middleware to attach time to the request
app.use((req, res, next) => {
    let req_time = new Date().toISOString();
    console.log('The time of the request:', req_time);
    req.body.timeApi = req_time;

    if (req.body.launch){
        
        req.body.openai = openai;
    }

    next();
});

// middlewares for the routes
app.use('/user', userRoute);
app.use('/company', companyRoute);
app.use('/login', loginRoute);
app.use('/shared', sharedRoute);

// Initiating the server on a PORT
const port = process.env.PORT;
app.listen(port, () => {
    console.log("App is running on port:", port);
});
