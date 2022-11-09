//Load dependencies
const express = require("express");                     //express is the web framework used to build this api
const bodyParser = require("body-parser");              //body-parser module parses the requests and creates req.bosy object to access in routes
const mongoose = require("mongoose");                   //mongoose is the database
const dbConfig = require('./config/database.config.js');//The Database Configuration Module is created seperately and imported to make modifying the database safer and easier

const app = express();                                  //Here express app is created and body-parser middlewares are implemented for req, res sequences
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise;
//Connection to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(()=>{
    console.log("Succesfully connected to the database");
}).catch(err =>{
    console.log("Could not connect to the database. Exiting.", err);
    process.exit();
});

app.get('/',(req, res)=>{                                //Define a simple GET route to initate the server
    res.json({"message": "Welcome to notes application."});
});

let PORT = 4040                                          //Listening port is a template literal so we can easily change ports

require("./app/routes/note.routes.js")(app);   //routes are included into server.js

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);  //backtick(` `) is very difficult to distinguish from (' ') if not carefull!
});


//The API is tested using Postman, all features are operational.