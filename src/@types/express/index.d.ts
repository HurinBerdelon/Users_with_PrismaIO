// Adding property id to type Request of Express
// Used to pass user_id in the request, to ensure user is authenticated
declare namespace Express {
    export interface Request {
        user: {
            id: string
        }
    }
}