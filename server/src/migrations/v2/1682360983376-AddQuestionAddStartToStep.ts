import {MigrationInterface, QueryRunner} from "typeorm";

export class AddQuestionAddStartToStep1682360983376 implements MigrationInterface {
    name = 'AddQuestionAddStartToStep1682360983376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying, "stepId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "step" ADD "start" character varying`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_7fdf334f45b9123f59612d9cf9e" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_7fdf334f45b9123f59612d9cf9e"`);
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "start"`);
        await queryRunner.query(`DROP TABLE "question"`);
    }

}
