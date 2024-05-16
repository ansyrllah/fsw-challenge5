import {Model, ModelObject} from 'objection';

export class carsModel extends Model {
   id!: number;
   cars_name!: string;
   cars_price!: number;
   cars_image!: string;
   cars_size!: string;
   cars_start_rent!: Date;
   end_rent!: Date;
   created_at!: Date;
   updated_at!: Date;

   static get tableName() {
      return 'cars'
   }
}

export type cars = ModelObject<carsModel>