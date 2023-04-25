import joi, { ref } from 'joi'
import { getEthMonthDaysCount, getGregMonthDaysCount } from '../helpers/CalendarFunctions';


function dayValidator(data : any ,  helpers : joi.CustomHelpers<any> , isGregorian : boolean)
{
    console.log(data);
    const {day,month,year} = data;
    const daysCount = isGregorian ? getGregMonthDaysCount(month,year) : getEthMonthDaysCount(month,year); ;
    if( day > daysCount )
        return helpers.message({custom : "day should not exceed amount per month"})
    return (data);

}


export const EventDateSchema  =  joi.object({
    month: joi.when(ref('isGregorian'),[{is:true , then : joi.number().min(0).max(11).required(), otherwise : joi.number().min(1).max(12).required()}]), 
    year: joi.number().min(1).required(),
    day: joi.number().min(1).max(31).required(),
}).when(ref('isGregorian'),[{is : true , then : joi.custom((data, helpers) => { return dayValidator(data , helpers , true)}),
     otherwise : joi.custom((data, helpers) => {return dayValidator(data,helpers,false)})}]);

export const EventTimeSchema =  EventDateSchema.append({
    hour: joi.number().min(0).max(23).required(),
    minute: joi.number().min(0).max(59).required()
});



const EventSchema  = joi.object({
    id : joi.string().guid({version : 'uuidv4'}).required(),
    title:  joi.string().max(40).min(3).required(),
    type: joi.string().valid('event','holiday','exam').lowercase().required(),
    color: joi.string().regex(/^\#[0-9a-fA-F]{6}$/).required(),
    startDateTime: EventTimeSchema,
    endDateTime: EventTimeSchema,
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
    data : EventSchema.fork(['id'] , key => key.empty().optional())});

export const EditEventSchema = joi.object({
    
    isGregorian : joi.boolean(),
    prevData : joi.object({
        id : joi.string().guid({version : 'uuidv4'}).required(),
        startDateTime: EventTimeSchema,
        endDateTime: EventTimeSchema,
        recurringOn: joi.number().max(4).min(0).required(),
        recurringId: joi.number().required().min(0),
        }),
    newData : EventSchema,
    editAll : joi.boolean().required(),
    startDay :  EventDateSchema, 
    endDay : EventDateSchema,
    
 });

 export const DeleteEventSchema = joi.object({
   data : {
    id : joi.string().guid({version : 'uuidv4'}).required(),
    recurringOn: joi.number().max(4).min(0).required(),
    recurringId: joi.number().required().min(0),
    deleteAll : joi.boolean().required() 
   }

 }); 

