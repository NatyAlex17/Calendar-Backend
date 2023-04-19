import express , {  Request,Response ,NextFunction} from "express";
import EventModel  from "../models/eventModel";
import {addRecurringEvents, createEvent } from "../helpers/Event-Functions";

const router = express.Router();

router.post("/event",function (req:Request , res : Response , next : NextFunction ) 
{
    const {data , isGregorian }  = req.body;

     
    //let event = undefined;
    if(data.recurringOn !== 0 )
    {
        const recurringEvents = addRecurringEvents(data,isGregorian);
        EventModel.insertMany(recurringEvents).then((docs) => {
            console.log(docs);
            res.status(200).json(docs);
        }).catch(err => {
            console.log(err);
            res.status(500).send("error occured  ");
        });
    }
    else
    {
        const event = createEvent(data);
        EventModel.create(event).then((doc) => {
            console.log(doc);
            res.status(200).json(doc);
        }).catch(err => {
            console.log(err);
            res.status(500).send("error occured  ");
        });
    }
    
    
/*     const vent = new EventModel({
        id:data.id,
        title : data.title,
        type : data.type,
        color : data.color,
        startDateTime : {
            day : data.startDateTime.day,
            month :data.startDateTime.month,
            year : data.startDateTime.year,
            hour : data.startDateTime.hour,
            minute : data.startDateTime.minute,
        },
        endDateTime : {
            day : data.endDateTime.day,
            month :data.endDateTime.month,
            year : data.endDateTime.year,
            hour : data.endDateTime.hour,
            minute : data.endDateTime.minute,
        },
        actionUrl : data.actionUrl,
        fromApp : data.fromApp,
        toApp : data.toApp,
        shortDescription : data.shortDescription,
        image : data.image,
        recurringOn : data.recurringOn,
        recurringId : data.recurringId,
        isPublicHoliday : data.isPublicHoliday

        
    }); */

    
})




router.get("/events",async function (req:Request , res : Response , next : NextFunction ) 
{
   
    const events = await EventModel.find();
   
    res.status(200).json({
        eventData : events,
        size : events.length
    });
});

export {router as eventRouter}