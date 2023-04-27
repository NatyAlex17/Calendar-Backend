import Joi from "joi";

export type Err = {
    ErrorCode: number,
    ErrorDetail : object | string,
    ErrorMessage : string,
    ErrorType : string
}



export function validationErrorHandler(error : Joi.ValidationError)
{
    //console.log(error.message);
    const regEX = /(\".+\")(.+)/;
    const errorMsg = error.message.match(regEX);
    return {
        ErrorCode : 400,
        ErrorType : "Validation Error",
        ErrorMessage : "Please , provide the correct event details ",
        ErrorDetail : {detail : `${error.details[0].context?.key}${errorMsg?.[2]} `.toString()}
    }

}
