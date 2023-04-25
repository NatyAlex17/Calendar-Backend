import joi from 'joi'
import { getEthMonthDaysCount, getGregMonthDaysCount } from '../helpers/CalendarFunctions';

const EventTimeSchema = joi.object({
    startDateTime: {
        day: joi.number().min(1).max(31).required(),
        month: joi.number().min(0).max(12).required(),
        year: joi.number().min(1).required(),
        hour: joi.number().min(0).max(23).required(),
        minute: joi.number().min(0).max(59).required()
    },
    endDateTime: {
        day: joi.number().min(1).max(31).required(),
        month: joi.number().min(0).max(12).required(),
        year: joi.number().min(1).required(),
        hour: joi.number().min(0).max(23).required(),
        minute: joi.number().min(0).max(59).required()
    }
});


const EventSchema  = joi.object({
    id : joi.string().guid({version : 'uuidv4'}).required(),
    title:  joi.string().max(40).min(3).required(),
    type: joi.string().valid('event','holiday','exam').lowercase().required(),
    color: joi.string().regex(/^\#[0-9a-fA-F]{6}$/).required(),
    startDateTime: {
        day: joi.number().min(1).max(31).required(),
        month: joi.number().min(0).max(12).required(),
        year: joi.number().min(1).required(),
        hour: joi.number().min(0).max(23).required(),
        minute: joi.number().min(0).max(59).required()
    },
    endDateTime: {
        day: joi.number().min(1).max(31).required(),
        month: joi.number().min(0).max(12).required(),
        year: joi.number().min(1).required(),
        hour: joi.number().min(0).max(23).required(),
        minute: joi.number().min(0).max(59).required()
    },
    actionUrl: joi.string().required(),
    fromApp: joi.string().required(),
    toApp: joi.string().required(),
    shortDescription: joi.string().required(),
    image: joi.string(),
    recurringOn: joi.number().max(4).min(0).required(),
    recurringId: joi.number().required().min(0),
    isPublicHoliday: joi.boolean().required(), 
});

export const AddEventSchema = joi.object({
    isGregorian : joi.boolean().required(),
    data : {
        title:  joi.string().max(40).min(3).required(),
        type: joi.string().valid('event','holiday','exam').lowercase().required(),
        color: joi.string().regex(/^\#[0-9a-fA-F]{6}$/).required(),
        startDateTime: {
            day: joi.number().min(1).max(31).required(),
            month: joi.number().min(0).max(12).required(),
            year: joi.number().min(1).required(),
            hour: joi.number().min(0).max(23).required(),
            minute: joi.number().min(0).max(59).required()
        },
        endDateTime: {
            day: joi.number().min(1).max(31).required(),
            month: joi.number().min(0).max(12).required(),
            year: joi.number().min(1).required(),
            hour: joi.number().min(0).max(23).required(),
            minute: joi.number().min(0).max(59).required()
        },
        actionUrl: joi.string().required(),
        fromApp: joi.string().required(),
        toApp: joi.string().required(),
        shortDescription: joi.string().required(),
        image: joi.string(),
        recurringOn: joi.number().max(4).min(0).required(),
        recurringId: joi.number().required().min(0),
        isPublicHoliday: joi.boolean().required(), 
    }
});

export const EditEventSchema = joi.object({
    
    isGregorian : joi.boolean(),
    prevData : joi.object({
        id : joi.string().guid({version : 'uuidv4'}).required(),
        startDateTime: {
            day: joi.number().min(1).max(31).required(),
            month: joi.number().min(0).max(12).required(),
            year: joi.number().min(1).required(),
            hour: joi.number().min(0).max(23).required(),
            minute: joi.number().min(0).max(59).required()
        },
        endDateTime: {
            day: joi.number().min(1).max(31).required(),
            month: joi.number().min(0).max(12).required(),
            year: joi.number().min(1).required(),
            hour: joi.number().min(0).max(23).required(),
            minute: joi.number().min(0).max(59).required()
        },
        recurringOn: joi.number().max(4).min(0).required(),
        recurringId: joi.number().required().min(0),
        }),
    newData : EventSchema,
    editAll : joi.boolean().required(),
    startDay :  {
        day: joi.number().min(1).max(31).required(),
        month: joi.number().min(0).max(12).required(),
        year: joi.number().min(1).required()
        
    } , 
    endDay : {
        day: joi.number().min(1).max(31).required(),
        month: joi.number().min(0).max(12).required(),
        year: joi.number().min(1).required()
    },
    
 });

 export const DeleteEventSchema = joi.object({
   data : {
    id : joi.string().guid({version : 'uuidv4'}).required(),
    recurringOn: joi.number().max(4).min(0).required(),
    recurringId: joi.number().required().min(0),
    deleteAll : joi.boolean().required() 
   }

 }); 

