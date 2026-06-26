import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1740000000000 implements MigrationInterface {
  name = 'InitialSchema1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "phone" character varying(32),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "token_hash" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_user_id" ON "refresh_tokens" ("user_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "groups" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(255) NOT NULL,
        "owner_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_groups" PRIMARY KEY ("id"),
        CONSTRAINT "FK_groups_owner" FOREIGN KEY ("owner_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "group_members" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "group_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_group_members" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_group_members_group_user" UNIQUE ("group_id", "user_id"),
        CONSTRAINT "FK_group_members_group" FOREIGN KEY ("group_id")
          REFERENCES "groups"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_group_members_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_group_members_group_id" ON "group_members" ("group_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_group_members_user_id" ON "group_members" ("user_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "start_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "end_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "location" character varying(500),
        "group_id" uuid NOT NULL,
        "created_by_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events" PRIMARY KEY ("id"),
        CONSTRAINT "FK_events_group" FOREIGN KEY ("group_id")
          REFERENCES "groups"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_events_created_by" FOREIGN KEY ("created_by_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_events_group_id" ON "events" ("group_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "event_assignees" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "event_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_assignees" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_event_assignees_event_user" UNIQUE ("event_id", "user_id"),
        CONSTRAINT "FK_event_assignees_event" FOREIGN KEY ("event_id")
          REFERENCES "events"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_event_assignees_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_event_assignees_event_id" ON "event_assignees" ("event_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_event_assignees_user_id" ON "event_assignees" ("user_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "type" character varying(100) NOT NULL,
        "message" text NOT NULL,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "event_assignees"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "group_members"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
