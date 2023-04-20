import mongoose, { Schema } from "mongoose";

export const eventTimeSchema = new Schema({
    day: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    hour: {type: Number, required: true},
    minute: {type: Number, required: true},
      },{_id: false});
  
  export const eventSchema = new Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    type: {type: String, required: true},
    color: {type: String, required: true},
    startDateTime: eventTimeSchema,
    endDateTime: eventTimeSchema,
    actionUrl: {type: String, required: true},
    fromApp: {type: String, required: true},
    toApp: {type: String, required: true},
    shortDescription: {type: String, required: true},
    image: String,
    recurringOn: Number,
    recurringId: Number,
    isPublicHoliday: Boolean
  });

  const EventModel = mongoose.models.Event || mongoose.model('Event', eventSchema);
  
  export default EventModel;