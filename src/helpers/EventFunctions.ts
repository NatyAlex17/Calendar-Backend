import { randomUUID } from "crypto";
import { v4 as uuidV4 } from 'uuid';
import { date, getEthiopicDay } from "./CalendarFunctions";
import CalendarConverter from "./CalendarConverter";

export type EventTime = {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number; 
};

export type Event = {
    id?: string;
    title: string;
    type: string;
    color: string;
    startDateTime: EventTime;
    endDateTime:  EventTime;
    actionUrl: string,
    fromApp: string,
    toApp: string,
    shortDescription: string;
    image ?: string;
    recurringOn?: number;
    recurringId?: number; 
    isPublicHoliday?: boolean;
};

/* 
export type EventReq = Event & {
    startDateTime: Date;
    endDateTime: Date;
   }
export type EventDB = Event & {
    startDateTime: EventTime;
    endDateTime:  EventTime;
   }
*/


const calendarConverter = new CalendarConverter();


export function createEvent(event: Event, id?: string, recurringId?: number){
    return {
      id: id ? id : uuidV4(),
      title: event.title,
      type: event.type,
      shortDescription: event.shortDescription,
      recurringOn: event.recurringOn,
      recurringId: recurringId ? recurringId : 0,
      startDateTime: { 
        day: event.startDateTime.day,
        month: event.startDateTime.month,
        year: event.startDateTime.year,
        hour: event.startDateTime.hour,
        minute: event.startDateTime.minute },
      endDateTime: { 
        day: event.endDateTime.day,
        month: event.endDateTime.month,
        year: event.endDateTime.year,
        hour: event.endDateTime.hour,
        minute: event.endDateTime.minute},
      fromApp: 'https://ekhool.com/',
      toApp: 'https://ekhool.com/',
      image: event.type  === 'holiday' ? 
              'https://img.freepik.com/free-vector/elegant-merry-christmas-background-with-white-christmas-ornament_44538-4702.jpg':
              'https://media.istockphoto.com/id/1316714426/vector/hand-drawn-doodle-calendar-and-clock-illustration-vector.jpg?s=612x612&w=0&k=20&c=CLKFfph4pU_vBcbs3HA3kjsidh0qtHdtEW79Ze4UGmU=',
      color: event.type === 'holiday' ? '#c41785' : event.color,
      actionUrl: 'https://ekhool.com/',
      isPublicHoliday: false
    };
  }

 export function addRecurringEvents(event: Event, isGregorian : boolean, id?: string){

    let convertedDate: date;
    const startDateTime = new Date(event.startDateTime.year, event.startDateTime.month, event.startDateTime.day, event.startDateTime.hour, event.startDateTime.minute);
    const endDateTime = new Date(event.endDateTime.year, event.endDateTime.month, event.endDateTime.day, event.endDateTime.hour, event.endDateTime.minute);
    const newEvents: Event[] = [] as Event[];
    const duration = endDateTime.getTime() - startDateTime.getTime();
    let recurrentDayIndex = Math.ceil(startDateTime.getDate() / 7);
    if(!isGregorian){
      convertedDate = calendarConverter.convertToEC(startDateTime.getFullYear(), startDateTime.getMonth() + 1, startDateTime.getDate());
      recurrentDayIndex = Math.ceil(convertedDate.day / 7);
    }
    let eventDayIndex: number, eventStart: Date, eventEnd: Date;
    let weekDay: number;
    //let eventId : string = id ? id : randomUUID();
    let eventId = id ? id : uuidV4();
    if(event.recurringOn !==0){
      for(let i = 0, j = 1; i <= 40; ){  
        eventStart = new Date(startDateTime.getTime());
        eventStart.setDate(eventStart.getDate() + i);
        eventEnd = new Date(eventStart.getTime() + duration);
        if(event.recurringOn === 2){
          i +=7;
        }else if(event.recurringOn === 3){
          i++; 
          weekDay = eventStart.getDay();
          if(weekDay === 0 || weekDay === 6){
            continue;
          }       
        }else if(event.recurringOn === 4){
          i+=7;
          eventDayIndex = Math.ceil(eventStart.getDate() / 7);
          if(!isGregorian){
            convertedDate = calendarConverter.convertToEC(eventStart.getFullYear(), eventStart.getMonth() + 1, eventStart.getDate());
            eventDayIndex = Math.ceil(convertedDate.day / 7); 
          }
          
          if(eventDayIndex !== recurrentDayIndex){
            if(recurrentDayIndex === 5 && eventDayIndex === 4){
                if(isGregorian && (Math.ceil(new Date(eventStart.getTime() + (7 * 86400000)).getDate() / 7) < 3)){
                  i+=7;
                }else if(!isGregorian && 
                         (Math.ceil(getEthiopicDay(convertedDate!.month - 1, convertedDate!.year, convertedDate!.day + 7).day / 7) < 3)){
                  i+=7;
                }else{
                  continue;
                }
            } else{
              continue;
            }
        } 
      }else{
          i++;
      }
        event.startDateTime = {year: eventStart.getFullYear(), month: eventStart.getMonth(), day: eventStart.getDate(), hour: eventStart.getHours(), minute: eventStart.getMinutes()};
        event.endDateTime = {year: eventEnd.getFullYear(), month: eventEnd.getMonth(), day: eventEnd.getDate(), hour: eventEnd.getHours(), minute: eventEnd.getMinutes()};
       newEvents.push(createEvent(event, eventId, j)); 
       j++;
      }
    }
    return newEvents;   
  }

  export function editEvent(event: Event, id?: string){
    return {
      id: id ? id : uuidV4(),
      title: event.title,
      type: event.type,
      shortDescription: event.shortDescription,
      recurringOn: event.recurringOn,
      startDateTime: { 
        day: event.startDateTime.day,
        month: event.startDateTime.month,
        year: event.startDateTime.year,
        hour: event.startDateTime.hour,
        minute: event.startDateTime.minute },
      endDateTime: { 
        day: event.endDateTime.day,
        month: event.endDateTime.month,
        year: event.endDateTime.year,
        hour: event.endDateTime.hour,
        minute: event.endDateTime.minute},
      fromApp: 'https://ekhool.com/',
      toApp: 'https://ekhool.com/',
      image: event.type  === 'holiday' ? 
              'https://img.freepik.com/free-vector/elegant-merry-christmas-background-with-white-christmas-ornament_44538-4702.jpg':
              'https://media.istockphoto.com/id/1316714426/vector/hand-drawn-doodle-calendar-and-clock-illustration-vector.jpg?s=612x612&w=0&k=20&c=CLKFfph4pU_vBcbs3HA3kjsidh0qtHdtEW79Ze4UGmU=',
      color: event.type === 'holiday' ? '#c41785' : event.color,
      actionUrl: 'https://ekhool.com/',
      isPublicHoliday: false
    };
  }