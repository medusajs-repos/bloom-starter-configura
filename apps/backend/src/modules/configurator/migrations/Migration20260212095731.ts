import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260212095731 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "configurator_option" add column if not exists "product_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "configurator_option" drop column if exists "product_id";`);
  }

}
