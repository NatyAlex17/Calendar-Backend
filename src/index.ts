import express, { Application , Request , Response , NextFunction } from "express";
import mongoose from "mongoose";
import { eventRouter } from "./routes/eventRouter";
import EventModel from "./models/eventModel";
import { readFile } from "fs";
import dotenv from 'dotenv';
import cors from 'cors';

const app : Application  = express();
app.use(express.json());
dotenv.config();
const corsOption = {
    origin: "http://localhost:3001",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOption));

const dbUri = process.env.MONGODB_URI || '';

if(!dbUri){
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

app.set('port', process.env.PORT || 5000);

mongoose.connect(dbUri)
         .then((conn) => {

            console.log("mongoose connected"); 

           /*  EventModel.findOne({isPublicHoliday: true})
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
                      }); */

            app.use("/api", eventRouter);
            app.listen(app.get('port'), () => {
                console.log("Waiting for request....");
            })

      }).catch(err => {
         console.log("An error occurred: ", err);
})



app.use((error: any , request: Request, response: Response, next: Function) => {
    response.status(500).json(error);
});