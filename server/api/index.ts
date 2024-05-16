import { Request, Response } from 'express';
//knex
import { carsModel } from '../../models/cars';
//endknex
import {UploadApiResponse, UploadApiErrorResponse} from 'cloudinary';
import cloudinary from '../midleware/cloudinary';

async function addCar(req:Request, res:Response){
   if(!req.body){
       return res.status(400).send("Invalid Request")
   }
   const fileBase64 = req.file?.buffer.toString("base64")
   const file = `data:${req.file?.mimetype};base64,${fileBase64}`

   cloudinary.uploader.upload(file, async function(err:UploadApiErrorResponse, result:UploadApiResponse){
       if(!!err){
           console.log(err)
           return res.status(400).send("Gagal upload file")
       }

       const cars = await carsModel.query().insert(
           {
               ...req.body,
               cars_image: result.url
           }
       ).returning('*')
       return res.status(201).json(cars)
   })
}

async function getCars(req:Request, res:Response){
   const { search } = req.query

    if(!search) {
        const cars = await carsModel.query();
        return res.status(200).json(cars)
    }

    const cars = await carsModel
        .query()
        .where('cars_name', 'like', `%${search}%`)
        .orWhere('cars_size', 'like', `%${search}%`);

    return res.status(200).json(cars)
}

async function getCarsId(req:Request, res:Response){
   const { id } = req.params
   try{
      const car = await carsModel.query().where('cars_id', id).throwIfNotFound();
       return res.status(200).json(car)
   } catch(e) {
       return res.status(404).send("Data tidak ditemukan!")
   }
   
}
async function deleteCar(req:Request, res:Response){
   const { id } = req.params

   try{
       const car = await carsModel.query().delete().where('cars_id', id).throwIfNotFound();
       return res.status(200).send("Data berhasil di hapus")

   } catch(e) {
       return res.status(404).send("Data tidak ditemukan!")
   }
}

async function updateCar(req:Request, res:Response){
   const { id } = req.params

    if(!req.file){
        try{
            const car = await carsModel.query()
                .where('cars_id', id)
                .patch(req.body)
                .throwIfNotFound()
                .returning("*");

            return res.status(200).send("Data berhasil di update")
        }catch (e){
            return res.status(404).send("Data tidak ditemukan!")
        }
    }

    const fileBase64 = req.file.buffer.toString("base64")
    const file = `data:${req.file.mimetype};base64,${fileBase64}`
    cloudinary.uploader.upload(file, async function(err:UploadApiErrorResponse, result:UploadApiResponse){
        if(!!err){
            console.log(err)
            return res.status(400).send("Gagal upload file")
        }
            const car = await carsModel.query()
                .where('cars_id', id)
                .patch({
                    ...req.body,
                    cars_image: result.url
                })
                .throwIfNotFound()
                .returning("*");

            return res.status(200).send("Data berhasil di update")
    })
}

export {
   addCar,
   getCars,
   getCarsId,
   deleteCar,
   updateCar
}