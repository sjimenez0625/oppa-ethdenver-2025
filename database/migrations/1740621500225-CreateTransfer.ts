import { MigrationInterface, QueryRunner } from "typeorm";

export class  $CreateTransfer1740621500225 implements MigrationInterface {
    name = ' $CreateTransfer1740621500225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "txHash" character varying(100), "status" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "identity" DROP CONSTRAINT "FK_12915039d2868ab654567bf5181"`);
        await queryRunner.query(`ALTER TABLE "identity" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "identity" ADD CONSTRAINT "FK_12915039d2868ab654567bf5181" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_79345be54b82de8207be305a9d3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_79345be54b82de8207be305a9d3"`);
        await queryRunner.query(`ALTER TABLE "identity" DROP CONSTRAINT "FK_12915039d2868ab654567bf5181"`);
        await queryRunner.query(`ALTER TABLE "identity" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "identity" ADD CONSTRAINT "FK_12915039d2868ab654567bf5181" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "transfer"`);
    }

}
