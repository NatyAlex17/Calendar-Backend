import express , {  Request, Response, NextFunction} from "express";
import EventModel  from "../models/eventModel";
import { addRecurringEvents, createEvent, editEvent } from "../helpers/EventFunctions";
import { AddEventSchema, DeleteEventSchema, EditEventSchema } from "../validators/addEvent";
import { Err, validationErrorHandler } from "../errors/error";
import Joi from "joi";

const router = express.Router();

router.post( "/eventtime", async function (req:Request , res : Response , next : NextFunction ) {

    const {error , value} = AddEventSchema.validate(req.body);

    if(error)
    {
        //res.status(400).json(validationErrorHandler(error));
        return next(validationErrorHandler(error));
    }  
    else
    {
        res.status(200).json(value);
    }
    


});

/* router.get("/events",async function (req:Request , res : Response , next : NextFunction ) {
    try{
        if(req.body.year){
          const year = +(req.body.year);
          if(typeof year !== 'number' || year < 1){
            next({
              ErrorCode: 400,
              ErrorDetail: `Please send the correct input`,
              ErrorMessage: "Please use the correct input",
              ErrorType: "Input Error"
            })
            console.log("Input error: ", req.body);
          } else{
            const minYear = (year - 1) <= 1 ? 1 : (year - 1);
            const data = await EventModel.find({"startDateTime.year": {$gte: minYear, $lte: (year + 1)}});
            res.status(200).json({
                eventData: data,
                size: data.length  
            })
          }
        } else{
          const events = await EventModel.find();
          res.status(200).json({
              eventData : events,
              size : events.length
          }); 
        }
        
    } catch(error ){
        //res.status(500).send("Error occurred");
        next({
          ErrorCode: 500,
          ErrorDetail : error,
          ErrorMessage : " Can't Get Saved Events From Server , Please Try Again ",
          ErrorType : "DataBase Error"
        });
        console.log("Error occurred: ", error);
    }
    
}); */
router.get("/events",async function (req:Request , res : Response , next : NextFunction ) {
    try{
        if(Object.keys(req.body).length !== 0){
          const {error, value} = Joi.object({year: Joi.number().integer().min(1)}).validate(req.body);
          if(error){
            next(validationErrorHandler(error));
          }else{
            const minYear = (value.year - 1) <= 1 ? 1 : value.year - 1;
            const events = await EventModel.find({"startDateTime.year": {$gte: minYear, $lte: value.year + 1}});
            res.status(200).json({
              eventData: events,
              size: events.length
            })
          }
        }else {
          const events = await EventModel.find();
          res.status(200).json({
              eventData : events,
              size : events.length
          });
        }
        
    } catch(err ){
        next({
          ErrorCode: 500,
          ErrorDetail : err,
          ErrorMessage : " Can't Get Saved Events From Server , Please Try Again ",
          ErrorType : "DataBase Error"
        });
        console.log("Error occurred: ", err);
    }
    
});

router.get("/events/:year", async function(req: Request, res: Response, next: NextFunction){
  try{
    const year  = +(req.params.year.trim());   
    if(Number.isNaN(year) || year < 1 ){
      console.log(`Please use the correct route, /api/event/${req.params.year} can not be accessed `);
      next({
        ErrorCode: 400,
        ErrorDetail: `Please use the correct route, /api/event/${req.params.year} can not be accessed `,
        ErrorMessage: "Please use the correct route",
        ErrorType: "Route Error"
      })
    }else{
      const minYear = (year - 1) <= 1 ? 1 : year - 1;
      const data = await EventModel.find({"startDateTime.year": {$gte: minYear, $lte: year + 1}});
      res.status(200).json({
        eventData: data,
        size: data.length
      })
    }
    
  } catch(error){
      console.log("Fetching events failed... ", error);
      next({
        ErrorCode: 500,
        ErrorDetail : error,
        ErrorMessage : "Can't get events for the requested year, Please Try Again ",
        ErrorType : "DataBase Error"
      })
  }
})

router.get("/events/year", function(req:Request, res: Response, next: NextFunction){
  const {year} = req.body;
  // validate the year
  if(typeof year !== 'number' || year < 1){
    next({
      ErrorCode: 400,
      ErrorDetail: `Please send the correct input`,
      ErrorMessage: "Please use the correct input",
      ErrorType: "Input Error"
    })
    console.log("Input error: ", req.body);
  }else {
    const minYear = (year - 1) <= 1 ? 1 : (year - 1);
    EventModel.find({"startDateTime.year": {$gte: minYear, $lte: year + 1}})
              .then((data) => {
                res.status(200).json({
                  eventData: data,
                  size: data.length
                })
              }).catch((error) => {
                  console.log("Fetching events failed... ", error);
                  next({
                    ErrorCode: 500,
                    ErrorDetail : error,
                    ErrorMessage : "Can't get events for the requested year, Please try again ",
                    ErrorType : "DataBase Error"
                  })
              })
  }
})

router.post("/event", function (req: Request , res : Response , next : NextFunction ) {
   
   const {error, value}  = AddEventSchema.validate(req.body,{abortEarly : true});    

   if(error)
   {
      next(validationErrorHandler(error));
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
               next({
          ErrorCode: 500,
          ErrorDetail : error,
          ErrorMessage : " Can't Save Recurring Event , Please Try Again ",
          ErrorType : "DataBase Error"
        });
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
               next({
          ErrorCode: 500,
          ErrorDetail : err,
          ErrorMessage : " Can't Save Event , Please Try Again ",
          ErrorType : "DataBase Error"
        });
          });
      }
   }
          
})

router.put('/event', function (req: Request, res: Response, next: NextFunction){
    
    const {error , value} = EditEventSchema.validate(req.body);

    if(error)
    {
      next(validationErrorHandler(error));
    }
    else
    {
      const {prevData, newData, isGregorian, editAll, startDay, endDay} = value;
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
                                next({
                                  ErrorCode: 500,
                                  ErrorDetail : err,
                                  ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                                  ErrorType : "DataBase Error"
                                });
                              })

                 }).catch((err) => {
                    console.log("Error Occurred: ", error);
                    next({
                      ErrorCode: 500,
                      ErrorDetail : err,
                      ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                      ErrorType : "DataBase Error"
                    });
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
                                next({
                                  ErrorCode: 500,
                                  ErrorDetail : err,
                                  ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                                  ErrorType : "DataBase Error"
                                });
                            })
                }).catch((err) => {
                    console.log("Error Occurred... ", error);
                    next({
                      ErrorCode: 500,
                      ErrorDetail : err,
                      ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                      ErrorType : "DataBase Error"
                    });
                })
    } else {
        if(prevData.recurringOn !==0 && editAll){
            EventModel.updateMany({id: prevData.id}, editEvent(newData))
                      .then((result) => {
                        console.log("Event updated... ", result);
                        EventModel.find({id: prevData.id})
                                  .then((docs) => {
                                    console.log("Event list... ");
                                    res.status(200).json(docs);
                                  }).catch((err) => {
                                    console.log("Error occurred..... ", error);
                                    next({
                                      ErrorCode: 500,
                                      ErrorDetail : err,
                                      ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                                      ErrorType : "DataBase Error"
                                    }); 
                                  })
                        //res.status(200).send(result);
                      }).catch((err) => {
                        console.log("Error Occurred... ", err);
                        next({
                          ErrorCode: 500,
                          ErrorDetail : err,
                          ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                          ErrorType : "DataBase Error"
                        });
                      })
            
        } else{
            /* EventModel.updateOne({id: prevData.id, recurringId: prevData.recurringId}, editEvent(newData, prevData.id))
                      .then((result) => {
                        console.log("Event updated.... ", result);
                        res.status(200).send(result);
                      }).catch((err) => {
                        console.log("Error Occurred... ", err);
                        res.status(500).send("Error Occurred, Update Failed... ");
                      }) */
            EventModel.findOneAndUpdate({id: prevData.id, recurringId: prevData.recurringId}, createEvent(newData, prevData.id, prevData.recurringId), {new: true})
                      .then((doc) => {
                        console.log("Event updated.... ", doc);
                        res.status(200).send(new Array(doc));
                      }).catch((err) => {
                        console.log("Error Occurred... ", err);
                        next({
                          ErrorCode: 500,
                          ErrorDetail : err,
                          ErrorMessage : " Can't Save Changes Made On Recurring Event , Please Try Again ",
                          ErrorType : "DataBase Error"
                        });
                      })
        } 
    }
    }

})

router.delete('/event', function(req: Request, res: Response, next: NextFunction){
    const {error , value} = DeleteEventSchema.validate(req.body);

    if(error)
    {
      const err: Err = validationErrorHandler(error);
      console.log("the error is " ,err); 
      next(err);
    }
    else
    {
        const {data} = value;

          if(data.recurringOn === 0 || data.deleteAll){
            EventModel.deleteMany({id: data.id})
                      .then((result) => {
                        console.log("Event deleted... ", result);
                        res.status(200).send(result);
                      }).catch((err) => {
                        console.log("Error Occurred... ", error);
                        next({
                          ErrorCode: 500,
                          ErrorDetail : err,
                          ErrorMessage : " Can't Delete Events , Please Try Again ",
                          ErrorType : "DataBase Error"
                        });
                      });
        }else{
            EventModel.deleteOne({id: data.id, recurringId: data.recurringId})
                      .then((result) => {
                        console.log("Event deleted.... ", result);
                        res.status(200).send(result);
                      }).catch((err) => {
                        console.log("Error Occurred... ", error);
                        next({
                          ErrorCode: 500,
                          ErrorDetail : err,
                          ErrorMessage : " Can't Delete  Event , Please Try Again ",
                          ErrorType : "DataBase Error"
                        });
                      });
        }
    }

})

export {router as eventRouter}