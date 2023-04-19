import express ,{ Application } from "express";
import  mongoose, { Mongoose } from "mongoose";
import { eventRouter } from "./routes/eventRouter";
import EventModel from "./models/eventModel";
import { readFile, readFileSync } from "fs";
let app : Application = express();
app.use(express.json());
let mongoConn : Mongoose = new Mongoose();

const connectionStr1 = "mongodb+srv://nattytest1:passwd123@cluster0.yqu4bey.mongodb.net/Event?retryWrites=true&w=majority"; 
const connectionStr2 = "mongodb://127.0.0.1:27017/CalendarDB";

 mongoose.connect(connectionStr2).then((conn) => {
    

    EventModel.findOne({isPublicHoliday: true}).then(  (data) => {
       if(data === null)
       {
            try{
                readFile("../FilteredHolidays.json","utf-8",(err,data) => {
                if(err){
                    throw err;
                }
                EventModel.insertMany(JSON.parse(data))
                        .then((docs) => {
                        console.log('Data Inserted...', docs);
                    })
                        .catch((error) => {
                        throw error;
                        });
            }); 
        
            } catch(error){
                console.log("Error: ", error);
                return;
            }
       }

    }).catch( (err) => {
        console.log("Error");
    })
    //console.log();
    
    
    console.log("mongoose connected");    
    app.listen(5000, () => {
        console.log("Waiting for request....");
    })
    
  
   app.use("/api",eventRouter);

})
.catch(err => {
    console.log("an error occured", err);
})


