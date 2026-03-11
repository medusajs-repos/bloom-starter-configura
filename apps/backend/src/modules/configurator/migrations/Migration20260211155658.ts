import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260211155658 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "configurator_option" add column if not exists "parent_option_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "configurator_option" drop column if exists "parent_option_id";`);
  }

}
