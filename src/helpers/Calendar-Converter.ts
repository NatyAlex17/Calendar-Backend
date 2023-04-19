import {date} from './Calendar-Functions';
/* Using Private fields for the implementation */

/***
 *
 * This date converter implementation is based on Dr. Berhanu Beyene and Dr. Manfred Kudlek algorithm.
 *
 ***/

/* Era Definitions */
const JD_EPOCH_OFFSET_AMETE_ALEM = -285019;
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856;
//const JD_EPOCH_OFFSET_COPTIC = 1824665;
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;
const JD_EPOCH_OFFSET_UNSET = -1;
const nMonths = 12;
const monthDays: number[] = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // number of days for gregorian months
class CalendarConverter {

    #jdOffset: number = JD_EPOCH_OFFSET_UNSET;
    #year: number = -1;
    #month: number = -1;
    #day: number = -1;
    #dateIsUnset: boolean = true;
    isAmeteMihret: boolean;

    constructor() {
        this.isAmeteMihret = true;
    }

/* Utility Functions */
    #quotient(i: number, j: number): number {
        return Math.floor(i / j);
    }

    #mod(i: number, j: number): number {
        return i - j * Math.floor(i / j);
    }

    #isGregorianLeap(year: number): boolean {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    #isEthiopicLeap(year: number): boolean{
        return ((year + 1) % 4 === 0 );
    }
    
/* Era Functions */
    #setEra(era: number): void {
        if (JD_EPOCH_OFFSET_AMETE_ALEM === era || JD_EPOCH_OFFSET_AMETE_MIHRET === era) {
            this.#jdOffset = era;
        } else {
            throw new Error("Unknown Era: " + era);
        }
    }
    #isEraSet(): boolean {
        return JD_EPOCH_OFFSET_UNSET === this.#jdOffset ? false : true;
    }

    #unsetEra(): void {
        this.#jdOffset = JD_EPOCH_OFFSET_UNSET;
    }

    #unset(): void{
        this.#unsetEra();
        this.#year = -1;
        this.#month = -1;
        this.#day = -1;
        this.#dateIsUnset = true;
    }

    #isDateSet(): boolean{
        return (this.#dateIsUnset) ? false : true ;
    } 
/* Conversion Methods To/From the Julian Day Number and Ethiopic and Gregorian Calendars */
    #guessEraFromJDN(jdn: number): number{
        return (jdn >= (JD_EPOCH_OFFSET_AMETE_MIHRET + 365))  ? JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
    }

    //Computes the Julian day number of the given Ethiopic date
    //This method assumes that the JDN epoch offset has been set
    #ethiopicToJDN(year: number, month: number, day: number): number{
        const era = this.#isEraSet() ? this.#jdOffset : JD_EPOCH_OFFSET_AMETE_MIHRET;
        const jdn = (era + 365) + 
                    365 * (year - 1) + 
                    this.#quotient(year, 4) + 
                    30 * month +
                    day - 31;

        return jdn;
    } 

    //Computes the Ethiopic date from the given Julian day number
    #jdnToEthiopic(jdn: number, era: number): number[]{
        const r = this.#mod((jdn - era), 1461) ;
        const n = this.#mod(r, 365) + 365 * this.#quotient(r, 1460) ; 

        const year = 4 * this.#quotient((jdn - era), 1461) + 
                    this.#quotient(r, 365) -
                    this.#quotient(r, 1460);
        const month = this.#quotient(n, 30) + 1;
        const day = this.#mod(n, 30) + 1 ;
            
        return [year, month, day];
    }  

    #jdnToEthiopicSetEra(jdn: number): number[]{
        const era = this.#isEraSet() ? this.#jdOffset : this.#guessEraFromJDN(jdn);
        return this.#jdnToEthiopic(jdn, era);
    } 

    //Computes the Julian day number of the given Gregorian date.  
    #gregorianToJDN(year: number, month: number, day: number): number {
        const s = this.#quotient(year, 4) -
                  this.#quotient(year - 1, 4) -
                  this.#quotient(year, 100) +
                  this.#quotient(year - 1, 100) +
                  this.#quotient(year, 400) -
                  this.#quotient(year - 1, 400);
        const t = this.#quotient(14 - month, 12);
        const n = 31 * t * (month - 1) + 
                  (1 - t) * (59 + s + 30 * (month - 3) + this.#quotient((3 * month - 7), 5)) +
                  day - 1;
        const j = JD_EPOCH_OFFSET_GREGORIAN + 
                  365 * (year - 1) +
                  this.#quotient(year - 1,   4) -
                  this.#quotient(year - 1, 100) +
                  this.#quotient(year - 1, 400) +
                  n;
        return j;
    }

    //Computes the Gregorian Date from a given Julian Day Number
    #jdnToGregorian(jdn: number): number[]{
        const r2000 = this.#mod((jdn - JD_EPOCH_OFFSET_GREGORIAN), 730485);
        const r400 = this.#mod((jdn - JD_EPOCH_OFFSET_GREGORIAN), 146097);
        const r100 = this.#mod(r400, 36524);
        const r4 = this.#mod(r100, 1461);
    
        let n = this.#mod(r4, 365) + 365 * this.#quotient(r4, 1460);
        const s = this.#quotient(r4, 1095);
        
        const aprime = 400 * this.#quotient((jdn - JD_EPOCH_OFFSET_GREGORIAN), 146097) +
                       100 * this.#quotient(r400, 36524) + 
                       4 * this.#quotient(r100, 1461) +
                       this.#quotient(r4, 365) -
                       this.#quotient(r4, 1460) -
                       this.#quotient(r2000, 730484);
    
        const year = aprime + 1;
        const t = this.#quotient((364 + s - n), 306);
        let month = t * (this.#quotient(n, 31) + 1) + (1 - t) * (this.#quotient((5 * (n - s) + 13), 153) + 1);
        
        n +=  1 - this.#quotient(r2000, 730484);
        let day = n;
    
        if ((r100 === 0) && (n === 0) && (r400 !== 0)) {
            month = 12;
            day = 31;
        }
        else {
            monthDays[2] = (this.#isGregorianLeap(year) )? 29 : 28;
            for (let i = 1; i <= nMonths; i += 1) {
                if (n <= monthDays[i]) {
                    day = n;
                    break;
                }
                n -= monthDays[i];
            }
        }  
        return [year, month, day];
    } 

/* Conversion Methods To/From the Ethiopic and Gregorian Calendars */

    #ethiopicToGregorian(year: number, month: number, day: number): number[] {
        if (!this.#isEraSet()) {
            if (year <= 0) {
                this.#setEra(JD_EPOCH_OFFSET_AMETE_ALEM);
            }
            else {
                this.#setEra(JD_EPOCH_OFFSET_AMETE_MIHRET);
            }
        }
        const jdn = this.#ethiopicToJDN(year, month, day);
        return this.#jdnToGregorian(jdn);
    } 

    #ethiopicToGregorianWithEra(year: number, month: number, day: number, era: number): number[]{
        this.#setEra(era);
        const date = this.#ethiopicToGregorian(year, month, day);
        this.#unsetEra();
        return date;
    } 

    #gregorianToEthiopic(year: number, month: number, day: number): number[] {
        const jdn = this.#gregorianToJDN(year, month, day);
        return this.#jdnToEthiopic(jdn, this.#guessEraFromJDN(jdn));
    } 

/* Gregorian to/from Ethiopian Date Conversion APIs */

    // takes Ethiopian date and returns an equivalent Gregorian date
    convertToGC(year: number, month: number, day: number): date{
        if(day < 0 || day > 30 || month < 0 || month > 13){
            throw new Error("Invalid Ethiopian Date.");
        }
        if((day > 5 && month === 13) && !(this.#isEthiopicLeap(year))){
            throw new Error("The year is not a leap year")
        }
        const gregDate = this.#ethiopicToGregorian(year, month, day);
        return {year: gregDate[0], month: gregDate[1], day: gregDate[2]};
    } 

    // takes Gregorian date and returns an equivalent Ethiopian date
    convertToEC(year: number, month: number, day: number): date{
        if(day < 0 || day > 31 || month < 0 || month > 12){
            throw new Error("Invalid Gregorian Date.");
        }
        if((day > 28 && month === 2) && !(this.#isGregorianLeap(year))){
            throw new Error("The year is not a leap year")
        }
        const etDate = this.#gregorianToEthiopic(year, month, day);
        return {year: etDate[0], month: etDate[1], day: etDate[2]}
    }

   
    
    // get the index of the week day for a given Ethiopian Date
    getETWeekDay(year: number, month: number, day: number): number{
        const gregDate = this.convertToGC(year, month, day);
        const gregDateMod = new Date(gregDate.year, gregDate.month - 1, gregDate.day);
        gregDateMod.setFullYear(gregDate.year);
        const weekDay = gregDateMod.getDay();
        return weekDay;
    }

    // get the index of the week day where an Ethiopic month starts
    getETMonthStartDay(year: number, month: number): number{
        const gregDate = this.convertToGC(year, month, 1);
        const gregDateMod = new Date(gregDate.year, gregDate.month - 1, gregDate.day);
        gregDateMod.setFullYear(gregDate.year);
        const weekDay = gregDateMod.getDay();
        return weekDay;
    }  
    // get today in Ethiopic according to the timezone and localtime
    getETToday(){
        const gregToday = new Date(); // get today in gregorian
        const etLocalTime = new Date(gregToday.getTime() + ((-3 + (gregToday.getTimezoneOffset()/60)) * 3600000));
        const etToday = this.convertToEC(etLocalTime.getFullYear(), etLocalTime.getMonth() + 1, etLocalTime.getDate());
        return {...etToday, weekDay: etLocalTime.getDay(), hour: etLocalTime.getHours(), minute: etLocalTime.getMinutes()};
    }
}

export default CalendarConverter