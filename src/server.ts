import express, { application } from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
import "./config/mqtt";

connectDB()

const app = express()

//Cors
app.use(cors(corsConfig))

//Leer datos de formularios
app.use(express.json())

app.use('/', router)

export default app