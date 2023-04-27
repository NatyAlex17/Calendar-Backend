import Joi from "joi";


export function validationErrorHandler(error : Joi.ValidationError)
{
    console.log(error.message);
    const regEX = /(\".+\")(.+)/;
    const errorMsg = error.message.match(regEX);
    return {
        ErrorType : "Validation Error",
        ErrorMessage : "Please , provide the correct event details ",
        ErrorDetail : `${error.details[0].context?.key} ${errorMsg?.[1]} `
    }

}
