import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260212135214 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "configurator" add column if not exists "product_id" text null, add column if not exists "base_price" numeric null, add column if not exists "raw_base_price" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "configurator" drop column if exists "product_id", drop column if exists "base_price", drop column if exists "raw_base_price";`);
  }

}
