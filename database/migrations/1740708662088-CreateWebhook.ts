import { MigrationInterface, QueryRunner } from 'typeorm';

export class $CreateWebhook1740708662088 implements MigrationInterface {
  name = ' $CreateWebhook1740708662088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "webhook_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payload" character varying(50000), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "webhookId" uuid, CONSTRAINT "PK_5164958b17361a85955a433d958" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "webhook" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying(2048), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e6765510c2d078db49632b59020" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhook_log" ADD CONSTRAINT "FK_e5949e13017a380e61d79733d24" FOREIGN KEY ("webhookId") REFERENCES "webhook"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "webhook_log" DROP CONSTRAINT "FK_e5949e13017a380e61d79733d24"`,
    );
    await queryRunner.query(`DROP TABLE "webhook"`);
    await queryRunner.query(`DROP TABLE "webhook_log"`);
  }
}
