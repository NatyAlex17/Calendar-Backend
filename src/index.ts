import express from "express";
import mongoose from "mongoose";
import { eventRouter } from "./routes/eventRouter";
import EventModel from "./models/eventModel";
import { readFile } from "fs";
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
dotenv.config();

const dbUri = process.env.MONGODB_URI || '';

if(!dbUri){
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

mongoose.connect(dbUri)
         .then((conn) => {

            console.log("mongoose connected"); 

            /* EventModel.findOne({isPublicHoliday: true})
                      .then((data) => {
                            if(data === null){
                                try{
                                    readFile("FilteredHolidays.json", "utf-8", (err, data) => {
                                    if(err){
                                        console.log("Unable to read file: ", err);
                                        throw err;
                                    }
                                    EventModel.insertMany(JSON.parse(data))
                                            .then((docs) => {
                                                console.log('Data Inserted...', docs.slice(0, 10));
                                            }).catch((error) => {
                                                throw error;
                                            });
                                    }); 
                                
                                } catch(error){
                                    console.log("Error: ", error);
                                    return;
                                }
                            }
                      }).catch( (err) => {
                            console.log("Error: ", err);
                      }) */

            app.use("/api", eventRouter);
            app.set('port', process.env.PORT || 5000);
            app.listen(app.get('port'), () => {
                console.log("Waiting for request....");
            })

      }).catch(err => {
         console.log("An error occurred: ", err);
})


