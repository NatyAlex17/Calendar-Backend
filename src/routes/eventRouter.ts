import express , {  Request, Response, NextFunction} from "express";
import EventModel  from "../models/eventModel";
import { addRecurringEvents, createEvent } from "../helpers/EventFunctions";

const router = express.Router();

router.get("/events",async function (req:Request , res : Response , next : NextFunction ) {
    try{
        const events = await EventModel.find();
        res.status(200).json({
            eventData : events,
            size : events.length
        });
    } catch(error){
        res.status(500).send("Error Occured");
        console.log("Error occurred: ", error);
    }
    
});

router.post("/event", function (req: Request , res : Response , next : NextFunction ) {
    const {data , isGregorian }  = req.body;

    if(data.recurringOn !== 0 )
    {
        const recurringEvents = addRecurringEvents(data, isGregorian);
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
        
})

router.put('/event', function (req: Request, res: Response, next: NextFunction){

})

export {router as eventRouter}