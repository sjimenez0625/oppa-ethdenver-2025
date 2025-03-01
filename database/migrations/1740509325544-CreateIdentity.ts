import { MigrationInterface, QueryRunner } from "typeorm";

export class  $CreateIdentity1740509325544 implements MigrationInterface {
    name = ' $CreateIdentity1740509325544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "identity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" character varying(100), "principal" character varying(100), "privateKey" character varying(100), "publicKey" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "accountId" UNIQUE ("accountId"), CONSTRAINT "REL_12915039d2868ab654567bf518" UNIQUE ("userId"), CONSTRAINT "PK_ff16a44186b286d5e626178f726" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isMusician"`);
        await queryRunner.query(`ALTER TABLE "identity" ADD CONSTRAINT "FK_12915039d2868ab654567bf5181" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "identity" DROP CONSTRAINT "FK_12915039d2868ab654567bf5181"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isMusician" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "identity"`);
    }
}
