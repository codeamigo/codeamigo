import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCodesandboxIdToLesson1639151016650 implements MigrationInterface {
    name = 'AddCodesandboxIdToLesson1639151016650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "sandboxId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "sandboxId"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "position" integer`);
    }

}
