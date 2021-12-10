import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCodesandboxIdToLesson1639165796964 implements MigrationInterface {
    name = 'AddCodesandboxIdToLesson1639165796964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "codesandboxId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "codesandboxId"`);
        await queryRunner.query(`ALTER TABLE "step" ADD "position" integer`);
    }

}
