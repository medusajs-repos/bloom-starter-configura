import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260211152621 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "configurator" drop constraint if exists "configurator_handle_unique";`);
    this.addSql(`create table if not exists "configurator" ("id" text not null, "name" text not null, "handle" text not null, "description" text null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "configurator_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_configurator_handle_unique" ON "configurator" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_configurator_deleted_at" ON "configurator" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "configurator_step" ("id" text not null, "title" text not null, "description" text null, "order" integer not null, "image_url" text null, "configurator_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "configurator_step_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_configurator_step_configurator_id" ON "configurator_step" ("configurator_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_configurator_step_deleted_at" ON "configurator_step" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "configurator_option" ("id" text not null, "name" text not null, "description" text null, "image_url" text null, "price_modifier" numeric null, "order" integer not null, "step_id" text not null, "raw_price_modifier" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "configurator_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_configurator_option_step_id" ON "configurator_option" ("step_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_configurator_option_deleted_at" ON "configurator_option" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "configurator_step" add constraint "configurator_step_configurator_id_foreign" foreign key ("configurator_id") references "configurator" ("id") on update cascade;`);

    this.addSql(`alter table if exists "configurator_option" add constraint "configurator_option_step_id_foreign" foreign key ("step_id") references "configurator_step" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "configurator_step" drop constraint if exists "configurator_step_configurator_id_foreign";`);

    this.addSql(`alter table if exists "configurator_option" drop constraint if exists "configurator_option_step_id_foreign";`);

    this.addSql(`drop table if exists "configurator" cascade;`);

    this.addSql(`drop table if exists "configurator_step" cascade;`);

    this.addSql(`drop table if exists "configurator_option" cascade;`);
  }

}
