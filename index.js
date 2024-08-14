const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ilflx.mongodb.net/registrationFormDB`);
//registration schema
const registrationSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

//model of registration schema

const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
    
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/page/index.html");
});

app.post("/register",async (req,res) => {
    try{
        const {name, email, password} = req.body;
        const existingUser = await Registration.findOne({email: email});
        //check for existing user
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            });

            await registrationData.save();
            res.redirect("/success");
        }else{
            alert("User Already exist!");
            res.redirect("error");
        }

        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    catch(error){
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/page/success.html");
});

app.get("/error" , (req, res) => {
    res.sendFile(__dirname + "/page/error.html");
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
});