import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'

import { router } from './routes'
import './shared/container'
import { appErrorMiddleware } from './middleware/appErrorMiddleware'

// Express is a powerfull and easy to use web framework for Java(Type)script
const app = express()

// As all the information coming and going for and from this API are JSON objects, we should tell our app to user json extension from express
app.use(express.json())

app.use(router)

app.use(appErrorMiddleware)

export { app }