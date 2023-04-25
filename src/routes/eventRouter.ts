import express , {  Request, Response, NextFunction} from "express";
import EventModel  from "../models/eventModel";
import { addRecurringEvents, createEvent, editEvent } from "../helpers/EventFunctions";
import joi from 'joi';
import { error } from "console";
import { AddEventSchema, DeleteEventSchema, EditEventSchema } from "../validators/addEvent";

const router = express.Router();

router.get("/events",async function (req:Request , res : Response , next : NextFunction ) {
    try{
        const events = await EventModel.find();
        res.status(200).json({
            eventData : events,
            size : events.length
        });
    } catch(error){
        res.status(500).send("Error occurred");
        console.log("Error occurred: ", error);
    }
    
});

router.post("/event", function (req: Request , res : Response , next : NextFunction ) {
   
   const {error, value}  = AddEventSchema.validate(req.body,{abortEarly : true});    

   if(error)
   {
      res.status(400).json(error);
   }  
   else
   {  
     const {data , isGregorian }  = value;
   
      if(data.recurringOn !== 0 )
      {
          const recurringEvents = addRecurringEvents(data, isGregorian);
          EventModel.insertMany(recurringEvents).then((docs) => {
              console.log(docs);
              res.status(200).json(docs);
          }).catch(err => {
              console.log(err);
              res.status(500).send("error occurred  ");
          });
      }
      else
      {
          const event = createEvent(data);
          EventModel.create(event).then((doc) => {
              console.log(doc);
              res.status(200).json(new Array(doc));
          }).catch(err => {
              console.log(err);
              res.status(500).send("error occurred  ");
          });
      }
   }
          
})

router.put('/event', function (req: Request, res: Response, next: NextFunction){
    
    const {error , value} = EditEventSchema.validate(req.body);

    if(error)
    {
        console.log("Error on editing.... ", error);
        res.status(400).json(error.message);
    }
    else
    {
      const {prevData, newData, isGregorian, editAll, startDay, endDay} = value;
      console.log("previous data: ", prevData);
      console.log("new data: ", newData);
      const prevEventStart = new Date(prevData.startDateTime.year, prevData.startDateTime.month, prevData.startDateTime.day).getTime();
      const prevEventEnd = new Date(prevData.endDateTime.year, prevData.endDateTime.month, prevData.endDateTime.day).getTime();

      if(prevData.recurringOn !== 0 && newData.recurringOn === 0){ 
        EventModel.deleteMany({id: prevData.id})
                  .then((result) => {
                    console.log("Data is deleted... ", result);
                    EventModel.create(createEvent(newData, prevData.id))
                              .then((doc) => {
                                console.log("Event Edited.... ", doc);
                                res.status(200).json(new Array(doc));
                              }).catch((err) => {
                                console.log("Error Occurred... ", err);
                                res.status(500).send("Error Occurred, Edit Failed...");
                              })

                 }).catch((error) => {
                    console.log("Error Occurred: ", error);
                    res.status(500).send("Error Occurred, Delete Failed...");
                 })

    } else if((prevData.recurringOn !== newData.recurringOn) || 
              (editAll && (prevEventStart !== (new Date(startDay.year, startDay.month, startDay.day).getTime()) ||
                            prevEventEnd !== (new Date(endDay.year, endDay.month, endDay.day).getTime())))){

        EventModel.deleteMany({id: prevData.id})
                  .then((result) => {
                    console.log("Event Edited... ", result);
                    const recurringEvents = addRecurringEvents(newData, isGregorian, prevData.id);
                    EventModel.insertMany(recurringEvents)
                              .then((docs) => {
                                console.log("Event edited: ", docs);
                                res.status(200).json(docs);
                            }).catch((err) => {
                                console.log("Error Occurred... ", err);
                                res.status(500).send("Error Occurred, Edit Failed...");
                            })
                }).catch((error) => {
                    console.log("Error Occurred... ", error);
                    res.status(500).send("Error Occurred, Delete Failed...");
                })
    } else {
        if(prevData.recurringOn !==0 && editAll){
            EventModel.updateMany({id: prevData.id}, editEvent(newData, prevData.id))
                      .then((result) => {
                        console.log("Event updated... ", result);
                        res.status(200).send(result);
                      }).catch((err) => {
                        console.log("Error Occurred... ", err);
                        res.status(500).send("Error Occurred, Update Failed... ");
                      })
        } else{
            EventModel.updateOne({id: prevData.id, recurringId: prevData.recurringId}, editEvent(newData, prevData.id))
                      .then((result) => {
                        console.log("Event updated.... ", result);
                        res.status(200).send(result);
                      }).catch((err) => {
                        console.log("Error Occurred... ", err);
                        res.status(500).send("Error Occurred, Update Failed... ");
                      })
        } 
    }
    }

})

router.delete('/event', function(req: Request, res: Response, next: NextFunction){
    const {error , value} = DeleteEventSchema.validate(req.body);

    if(error)
    {
        res.status(400).json(error);
    }
    else
    {
        const {data} = value;

          if(data.recurringOn === 0 || data.deleteAll){
            EventModel.deleteMany({id: data.id})
                      .then((result) => {
                        console.log("Event deleted... ", result);
                        res.status(200).send(result);
                      }).catch((error) => {
                        console.log("Error Occurred... ", error);
                        res.status(500).send("Error Occurred, Delete Failed... ");
                      });
        }else{
            EventModel.deleteOne({id: data.id, recurringId: data.recurringId})
                      .then((result) => {
                        console.log("Event deleted.... ", result);
                        res.status(200).send(result);
                      }).catch((error) => {
                        console.log("Error Occurred... ", error);
                        res.status(500).send("Error Occurred, Delete Failed... ");
                      });
        }
    }


})

export {router as eventRouter}