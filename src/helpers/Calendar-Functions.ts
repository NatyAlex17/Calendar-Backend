import { randomUUID } from "crypto";
import { type } from "os";

  export type Day = {
    day: number;
    month: number;
    year: number;
    index: number;
    weekDay: number;
}

export type Week ={
    week: Day[];
    weekIndex: number;
}

export type date = {
    year: number;
    month: number;
    day: number;
  };



/* get Ethiopic month day count */
export function getEthMonthDaysCount(month: number, year: number): number{
    if(month !== 12){
         return 30; // all months except the 13th month has 30 days
    }else{
        return ((year + 1) % 4 === 0 ) ? 6 : 5; //13th month has 6 days if the year is leap year     
    }
}

// get ethiopian day
export function getEthiopicDay(month: number, year: number, currentDay: number){ 
    let pagumeDays: number; //get the number of days for 13th month of the year
    if(month !== 0){ 
        pagumeDays = getEthMonthDaysCount(12, year); // takes the same year as the specified month
    }else{
        pagumeDays = getEthMonthDaysCount(12, year - 1); // takes the previous year of the specified month
    }
    const extraDays = 30 + pagumeDays; 
    // get the week day for the first day of a given month and year
    if(month === 0){
        // display days of the previous month for Meskerem
        if(currentDay < 1){
           let prevDays = pagumeDays + currentDay;
            // display days of the 13th month (Pagume)
            if (prevDays > 0){
                return {day: prevDays, month: 12, year: year - 1 };
            }
            // display days of the 12th month (Nehase)
            return {day: 30 + prevDays, month: 11, year: year - 1};
        }
        // display days of the next month 
        if(currentDay > 30){
            return {day: currentDay - 30, month: month + 1, year: year };   
        }
        // display days of the current month (Meskerem)      
        return {day: currentDay, month: month, year: year };

        } else if(month === 11){
            // display days of the previous month for Nehase (12th month)
            if(currentDay < 1){
                return {day: 30 + currentDay, month: month - 1, year: year}; 
            }
            // display days of the next month
            if(currentDay > 30){
                // check if the days count go to next month or first month of next year
                if(currentDay <= extraDays){
                    // display days of the 13th month (Pagume)
                    return {day: currentDay - 30, month: month + 1, year: year };
                }
                // display days of the first month of next year (Meskerem)    
                return {day: currentDay - extraDays, month: 0, year: year + 1};
            }
            // display days of the current month (Nehase)
            return {day: currentDay, month: month, year: year};
        } else if(month === 12){
            // display days of the previous month for Pagume (13th month)
            if(currentDay < 1){
                // display days of the 12th month (Nehase)
                return {day: 30 + currentDay, month: month - 1, year: year}; 
            }
            if(currentDay > pagumeDays){
                // check if the days count go to the 1st month or 2nd month of next year
                if(currentDay <= extraDays){
                    // display days of the 1st month of next year (Meskerem)
                    return {day: currentDay - pagumeDays, month: 0, year: year + 1 };
                    }
                // display days of the 2nd month of next year (Tikimt)
                return {day: currentDay - extraDays, month: 1, year: year + 1 };
            }
                // display days of the current month (Pagume)
                return {day: currentDay, month: month, year: year };
        } else{
            // display the month days for any other month
            // display days of the previous month
            if(currentDay < 1){
                return {day: 30 + currentDay, month: month - 1, year: year}; 
            }
            // display days of the next month    
            if(currentDay > 30){
                return {day: currentDay - 30, month: month + 1, year: year };   
            } 
            // display days of the current month      
            return {day: currentDay, month: month, year: year };
        } 
}