exports.GptDescription = async (req,res, next) => {
    try{
        const openai = req.body.openai;

        let message = `As a professional seller, Generate a compelling sales description for this used car with the following characteristics. Brand: ${req.body.brand}, Model: ${req.body.model}, Model Year: ${req.body.modelYear}, First Registered: ${req.body.firstRegistered}, Mileage: ${req.body.mileage}, Fuel Type: ${req.body.fuelType}, Gearbox : ${req.body.gearbox}, Body type : ${req.body.bodyType}, Color : ${req.body.color}, Number of Doors:  ${req.body.numberOfDoors}, Number of Seats: ${req.body.numberOfSeats}, Engine size : ${req.body.engineSize}, Engine power  : ${req.body.enginePower}, EPA Ratings : ${req.body.epaRatings}, CO2 emissisions : ${req.body.co2Emissions}, Inside : ${req.body.inside}, Tyres: ${req.body.tyres}, Outside : ${req.body.outside}, Motor : ${req.body.motor}, Brakes: ${req.body.brakes}, Suspension: ${req.body.suspension}, Transmission : ${req.body.transmission}. Put emphasize on some characteristics and don't forget to mention that the user can come to see the car during available times.`

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

        let message = `What is the list of different options in a ${req.body.modelYear}, ${req.body.gearbox}, ${req.body.engineSize}, ${req.body.enginePower}, ${req.body.brand}, ${req.body.model}. Classify the options in response into 6 themes.`;

        // let message = `There are different options in a ${req.body.modelYear}, ${req.body.gearbox}, ${req.body.engineSize}, ${req.body.enginePower}, ${req.body.brand}, ${req.body.model}. Classify the options in response into 6 themes.`;

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: message}]
        });

        req.body.themes = gptResponse.data.choices[0].message.content;
        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({status:404, message: 'fail', data: err.message});
    }
}

exports.OrganizeData = async (req,res) => {
    try{
        let themes = req.body.themes;

        // console.log(themes);

        let lines = themes.split("\n\n");
        let newArr = [];
        let elemArr;

        // Getting proper array of strings
        for (let i=lines.length -1;i>=0;i--){
            elemArr = lines[i];
            if (elemArr[0]+elemArr[1] == '1.' || elemArr[0]+elemArr[1] == '2.' || elemArr[0]+elemArr[1] == '3.' || elemArr[0]+elemArr[1] == '4.' || elemArr[0]+elemArr[1] == '5.' || elemArr[0]+elemArr[1] == '6.'){
                newArr.push(elemArr);
            }
            if (elemArr[0]+elemArr[1] == '1.'){
                break;
            }
        }
        newArr = newArr.slice().reverse()

        elemArr = '';
        // elemArr = newArr[0].split("-");


        let obj = {};

        let objectKey = '';
        let valuesArray = [];
        let finalArray = [];


        for (let i=0; i<newArr.length;i++){
            elemArr = newArr[i].split("\n");
            
            objectKey = '';
            valuesArray = [];
            obj = {};
        
            objectKey = elemArr[0].slice(3, -1);
        
            for (let j=1;j<elemArr.length;j++){
              valuesArray.push(elemArr[j].slice(1))
            }
            obj[objectKey] = valuesArray;
            finalArray.push(obj);
        }
        

        console.log(finalArray);
        // res.send(themes);
        
        // res.status(200).json({status:200, message: 'success', themes: themes});

        res.status(200).json({status:200, message: 'success', description: req.body.description, themes: finalArray});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 404, message: 'fail', data: err.message});
    }
}