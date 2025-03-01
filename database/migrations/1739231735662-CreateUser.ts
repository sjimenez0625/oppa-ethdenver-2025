import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1739231735662 implements MigrationInterface {
  name = 'CreateUser1739231735662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying(100), "lastname" character varying(100), "profilePicture" character varying, "password" character varying, "username" character varying(200), "roles" text NOT NULL, "isAccountDisabled" boolean NOT NULL DEFAULT false, "email" character varying(200), "authId" character varying NOT NULL DEFAULT 'local', "bio" character varying, "dob" TIMESTAMP, "isMusician" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "email" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
