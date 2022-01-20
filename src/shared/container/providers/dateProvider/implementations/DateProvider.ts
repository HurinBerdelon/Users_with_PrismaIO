import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { injectable } from 'tsyringe';

import { IDateProvider } from "../IDateProvider";

// It is a very good practice to work with time and date in UTC on backend.
// As any API can be used on different timezones, It is preferable that front end 
// makes any conversion of timezone
dayjs.extend(utc)

// The date Provider class offer methods to serve formatted dates
@injectable()
class DateProvider implements IDateProvider {

    dateNow(): Date {
        return dayjs().toDate()
    }
    addDays(days: number): Date {
        return dayjs().add(days, 'days').toDate()
    }
    addHours(hours: number): Date {
        return dayjs().add(hours, 'hours').toDate()
    }
    compareExpiration(expiration: Date): boolean {
        return (this.dateNow() <= expiration)
    }
}

export { DateProvider }