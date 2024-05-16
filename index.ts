require('dotenv').config()
const {CLIENT, DATABASE, USER,PASSWORD} = process.env 
import express, { Express, Request, Response } from 'express';
import {addCar, getCars, getCarsId, deleteCar, updateCar} from './server/api'
//knex
import knex from 'knex'
import { Model } from 'objection';
import uploadOnMemory from './server/midleware/multerMemory'

const app: Express = express();
const port = 3000;

const knexInstance = knex({
   client: CLIENT,
   connection: {
      database: DATABASE,
      user: USER,
      password: PASSWORD,
      port: 5432
    }
})

Model.knex(knexInstance)

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
   res.send('Running using Typescript :)');
})

app.post('/api/cars',uploadOnMemory.single('cars_image'), addCar)
app.get('/api/cars', getCars)
app.get('/api/cars/:id', getCarsId)
app.delete('/api/cars/:id', deleteCar)
app.put('/api/cars/:id', uploadOnMemory.single('cars_image'), updateCar)

app.listen(port, () => {
   console.log(`[server]: Server is running at http://localhost:${port}`)
})