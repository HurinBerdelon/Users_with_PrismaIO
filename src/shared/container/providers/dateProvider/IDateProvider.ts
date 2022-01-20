// Date Providers class type, all classes created to serve as date providers should follow
// this "contract"

interface IDateProvider {
    dateNow(): Date
    addDays(days: number): Date
    addHours(hours: number): Date
    compareExpiration(expiration: Date): boolean
}

export { IDateProvider }