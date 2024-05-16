import { table } from "console";
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable('cars', (table: Knex.TableBuilder) => {
      table.increments('cars_id').primary();
      table.string('cars_name').notNullable();
      table.integer('cars_price').notNullable();
      table.string('cars_image').notNullable();
      table.string('cars_size').notNullable();
      table.date('cars_start_rent');
      table.date('end_rent');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
   }).raw(`
   CREATE OR REPLACE FUNCTION update_timestamp()
   RETURNS TRIGGER AS $$
   BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
   END;
   $$ language 'plpgsql';
`)
.raw(`
   CREATE TRIGGER update_timestamp
   BEFORE UPDATE ON cars
   FOR EACH ROW
   EXECUTE FUNCTION update_timestamp();
`);
}



export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("cars")
}

