const Car = require('../models/carModel');
const fs = require('fs');

const fetch = require('node-fetch');

exports.GptDescription = async (req,res, next) => {
    try{
        const openai = req.body.openai;

        let message;

            if (req.body.epaRatings){
            message = `As a professional seller, Generate a compelling sales description for this ${req.body.condition} car with the following characteristics. Brand: ${req.body.brand}, Model: ${req.body.model}, Model Year: ${req.body.modelYear}, First Registered: ${req.body.firstRegistered}, Mileage: ${req.body.mileage}, Fuel Type: ${req.body.fuelType}, Gearbox : ${req.body.gearbox}, Body type : ${req.body.bodyType}, Color : ${req.body.color}, Number of Doors:  ${req.body.numberOfDoors}, Number of Seats: ${req.body.numberOfSeats}, Engine size : ${req.body.engineSize}L, Engine power  : ${req.body.enginePower} bhp, EPA Ratings : ${req.body.epaRatings}, CO2 emissisions : ${req.body.co2Emissions}, Inside : ${req.body.inside}, Tyres: ${req.body.tires}, Outside : ${req.body.outside}, Motor : ${req.body.motor}, Brakes: ${req.body.brakes}, Suspension: ${req.body.suspension}, Transmission : ${req.body.transmission}. Put emphasize on some characteristics and don't forget to mention that the user can come to see the car during available times.`
        }
            else if (!req.body.epaRatings){
            message = `As a professional seller, Generate a compelling sales description for this ${req.body.condition} car with the following characteristics. Brand: ${req.body.brand}, Model: ${req.body.model}, Model Year: ${req.body.modelYear}, First Registered: ${req.body.firstRegistered}, Mileage: ${req.body.mileage}, Fuel Type: ${req.body.fuelType}, Gearbox : ${req.body.gearbox}, Body type : ${req.body.bodyType}, Color : ${req.body.color}, Number of Doors:  ${req.body.numberOfDoors}, Number of Seats: ${req.body.numberOfSeats}, Engine size : ${req.body.engineSize}L, Engine power  : ${req.body.enginePower} bhp, CO2 emissisions : ${req.body.co2Emissions}, Inside : ${req.body.inside}, Tyres: ${req.body.tires}, Outside : ${req.body.outside}, Motor : ${req.body.motor}, Brakes: ${req.body.brakes}, Suspension: ${req.body.suspension}, Transmission : ${req.body.transmission}. Put emphasize on some characteristics and don't forget to mention that the user can come to see the car during available times.`
        }
        
        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: message}]
        });

        req.body.description = gptResponse.data.choices[0].message.content;
        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}

exports.GptThemes = async (req,res,next) => {
    try{
        const openai = req.body.openai;
        const format = "The different options available in a 2018, Automatic, 1.0 L, 161 bhp, BMW 3 Series can be classified into the following themes:\n\n1. Interior & Comfort:\n- Leather seats\n- Heated front seats\n- Memory function for driver's seat\n- Dual-zone automatic climate control\n- Power-adjustable front seats with lumbar support \n\n2. Safety & Security:\n- Lane departure warning\n- Forward collision warning\n- Automatic emergency braking\n- Adaptive cruise control\n- Parking sensors (front and rear)"

        let message = `What is the list of different options in a ${req.body.modelYear}, ${req.body.gearbox}, ${req.body.engineSize} L, ${req.body.enginePower} bhp, ${req.body.brand}, ${req.body.model}. Your response should be in this format: ${format}. Classify the options in response into 6 themes. The response must have 6 themes`

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: message}]
        });

        req.body.themes = gptResponse.data.choices[0].message.content;

        // console.log(req.body.themes);
        // console.log('break');
        console.log(JSON.stringify(req.body.themes));

        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({status:404, message: 'fail', data: err.message});
    }
}

exports.OrganizeData = async (req,res,next) => {
    try{
        let themes = req.body.themes;

        let lines = themes.split("\n\n");
        let newArr = [];
        let elemArr, elemArrSub;

        // Getting array of strings
        for (let i=lines.length -1;i>=0;i--){
            elemArr = lines[i];
            if (elemArr[0]+elemArr[1] == '1.' || elemArr[0]+elemArr[1] == '2.' || elemArr[0]+elemArr[1] == '3.' || elemArr[0]+elemArr[1] == '4.' || elemArr[0]+elemArr[1] == '5.' || elemArr[0]+elemArr[1] == '6.'){
                newArr.push(elemArr);
            }

            if (elemArr.substring(0, 8) == 'Theme 1:' || elemArr.substring(0, 8) == 'Theme 2:' || elemArr.substring(0, 8) == 'Theme 3:' || elemArr.substring(0, 8) == 'Theme 4:' || elemArr.substring(0, 8) == 'Theme 5:' || elemArr.substring(0, 8) == 'Theme 6:'){
                elemArrSub = elemArr.substring(6);
                newArr.push(elemArrSub);
            }
            if (elemArr[0]+elemArr[1] == '1.' || elemArr.substring(0, 8) == 'Theme 1:'){
                break;
            }
        }
        newArr = newArr.slice().reverse()

        elemArr = '';
        let obj = {};
        let objectKey = '';
        let valuesArray = [];
        let finalArray = [];


        for (let i=0; i<newArr.length;i++){
            elemArr = newArr[i].split("\n");
            
            objectKey = '';
            valuesArray = [];
            obj = {};

            // Removing first 3 characters
            objectKey = elemArr[0].slice(3);
            // Removing the colon sign
            objectKey = objectKey.replace(/:/g, "");
            // Removing the extra space from the end
            objectKey = objectKey.replace(/\s+/g, ' ').trim();
        
            for (let j=1;j<elemArr.length;j++){
              valuesArray.push(elemArr[j].slice(1))
            }
            obj[objectKey] = valuesArray;
            finalArray.push(obj);
        }
        

        req.body.themes = finalArray;
        console.log('Organize data working');
        
        next();

    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}


exports.AutoSaveData = async (req,res) => {
    try{
        let userID;

        if (req.body.userID){
            userID = req.body.userID
        }
        else if (req.body.companyID){
            userID = req.body.companyID
        }

        let nameOfCar = req.body.brand + " " + req.body.model;

        const query = Car.create({
            description: req.body.description,
            name: nameOfCar,
            themes: req.body.themes,
            mileage: req.body.mileage,
            price: req.body.price,
            image: req.body.image,
            location: req.body.location,
            contact: req.body.contact,
            previousOwners: req.body.previousOwners,
            warrantyCoverage: req.body.warrantyCoverage,
            vehicleInspection: req.body.vehicleInspection,
            ownerID: userID,
            link: ""
        })
        const saveData = await query;


        const querySecond = Car.findOneAndUpdate({_id: saveData._id}, {link: `http://127.0.0.1:5173/sharedescription?carID=${saveData._id}`}, {new: true, runValidators: true});
        const finalData = await querySecond;

        console.log("autosave data working");

        res.status(200).json({status:200, message: 'success', data: finalData});

    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}

exports.ViewSharedCarInfo = async (req,res) => {
    try{

        const query = Car.findById(req.body.carID);
        const carInfo = await query;

        res.status(200).json({status:200, message: 'success', data: carInfo});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: fail, data: err.message})
    }
}

exports.CarFilters = async (req,res) => {
    try{

        let condition = {};

        // brand will always come from the request
        condition["Make"] = req.body.brand;

        if (req.body.model){
            condition["Model"] = req.body.model;
        }
        if (req.body.modelYear){
            condition["Year"] = req.body.modelYear;
        }
        
        // storing filters in an object and put it in a variable to be used in the URL
        const where = encodeURIComponent(JSON.stringify(condition));

        // Fetching Data from the 3rd party API of the database
        const response = await fetch(
        `https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?limit=9840&where=${where}`,
        {
            headers: {
            'X-Parse-Application-Id': 'bNtSJSD5FNQeA9pppIwEQi0IlhBMlTHIQhxltu6j', // This is your app's application id
            'X-Parse-REST-API-Key': 'pMjmj8x6b6jMSeUVIkI9PJq9vRrPWyUASLPaL8AP', // This is your app's REST API key
            }
        }
        );
        const data = await response.json();
        const cars = data.results


        let yearValues, uniqueYears, modelValues, uniqueModels;
        let finalData = {};

        // if just brand, return unique years and models
        if (!req.body.model && !req.body.modelYear){

            yearValues = cars.map(car => car.Year);
            uniqueYears = [...new Set(yearValues)];

            modelValues = cars.map(car => car.Model);
            uniqueModels = [...new Set(modelValues)];


            finalData.model = uniqueModels.sort();
            finalData.modelYear = uniqueYears;
        }

        // if brand + model, return model years
        if (req.body.model){
            yearValues = cars.map(car => car.Year);
            uniqueYears = [...new Set(yearValues)];

            finalData.modelYear = uniqueYears;
        }

        // if brand + model years, return models
        if (req.body.modelYear){
            modelValues = cars.map(car => car.Model);
            uniqueModels = [...new Set(modelValues)];

            finalData.model = uniqueModels.sort();
        }

        res.status(200).json({status: 200, message: 'success', data: finalData});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}

exports.SaveGptResponse = async (req,res) => {
    try{
        let userID;
        if (req.body.userID){
            userID = req.body.userID;
        }
        else if (req.body.companyID){
            userID = req.body.companyID;
        }

        const filter = {_id: req.body.carID};
        let update = {};

        if (req.body.description){
            update.description = req.body.description;
        }
        if (req.body.themes){
            update.themes = req.body.themes;
        }
        if (req.body.image){
            update.image = req.body.image;
        }

        const query = Car.findOneAndUpdate(filter, update, {new: true, runValidators: true});
        const saveCarInfo = await query;

        res.status(200).json({status:200, message: 'success', data: saveCarInfo});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}

exports.GetCarInformation = async (req,res) => {
    try{
        let userID;
        if (req.body.userID){
            userID = req.body.userID;
        }
        else if (req.body.companyID){
            userID = req.body.companyID;
        }

        const filter = {ownerID: userID};
        const query = Car.find(filter).sort({ createdAt: -1 });
        const carList = await query;

        res.status(200).json({status: 200, message: 'success', data: carList});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}