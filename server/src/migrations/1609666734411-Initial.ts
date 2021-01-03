import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1609666734411 implements MigrationInterface {
  name = "Initial1609666734411";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "code_module" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "value" character varying NOT NULL, "stepId" integer, CONSTRAINT "PK_2f27e8cca5d582e82fabeb997c9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "dependency" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "package" character varying NOT NULL, "version" character varying NOT NULL, "stepId" integer, CONSTRAINT "PK_d90752dc40dbb4eb7c3bbf53542" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "currentStep" integer NOT NULL, "lessonId" integer NOT NULL, "studentId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying, "likes" integer NOT NULL DEFAULT '0', "ownerId" integer, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "step" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "instructions" character varying NOT NULL, "lessonId" integer, "sessionId" integer, CONSTRAINT "PK_70d386ace569c3d265e05db0cc7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "checkpoint" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL DEFAULT '', "isCompleted" boolean NOT NULL DEFAULT false, "test" character varying NOT NULL, "moduleId" integer NOT NULL, "stepId" integer, CONSTRAINT "PK_fea86db187949398f8b614f730a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_students_user" ("lessonId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_5b5028d408ee3e1a36c7b852a2f" PRIMARY KEY ("lessonId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5ecea7fb2f4a99587daa7a9123" ON "lesson_students_user" ("lessonId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a210fa5d08ed65fc06c900caa" ON "lesson_students_user" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" ADD CONSTRAINT "FK_132fec4426468f2c89c5b8a3c7d" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "dependency" ADD CONSTRAINT "FK_68636397e81c879649e0b68924f" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_aab58f9e25cca87a369a4732bce" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_c001c8879994009b254888ab61c" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "step" ADD CONSTRAINT "FK_3f4cb6fe244ff0714645ce3d6f8" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "step" ADD CONSTRAINT "FK_f69225b88d4719037f96768b9ca" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "checkpoint" ADD CONSTRAINT "FK_82f585669590939ffd632480aaa" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_students_user" ADD CONSTRAINT "FK_5ecea7fb2f4a99587daa7a91233" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_students_user" ADD CONSTRAINT "FK_1a210fa5d08ed65fc06c900caa4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_students_user" DROP CONSTRAINT "FK_1a210fa5d08ed65fc06c900caa4"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_students_user" DROP CONSTRAINT "FK_5ecea7fb2f4a99587daa7a91233"`
    );
    await queryRunner.query(
      `ALTER TABLE "checkpoint" DROP CONSTRAINT "FK_82f585669590939ffd632480aaa"`
    );
    await queryRunner.query(
      `ALTER TABLE "step" DROP CONSTRAINT "FK_f69225b88d4719037f96768b9ca"`
    );
    await queryRunner.query(
      `ALTER TABLE "step" DROP CONSTRAINT "FK_3f4cb6fe244ff0714645ce3d6f8"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_c001c8879994009b254888ab61c"`
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_aab58f9e25cca87a369a4732bce"`
    );
    await queryRunner.query(
      `ALTER TABLE "dependency" DROP CONSTRAINT "FK_68636397e81c879649e0b68924f"`
    );
    await queryRunner.query(
      `ALTER TABLE "code_module" DROP CONSTRAINT "FK_132fec4426468f2c89c5b8a3c7d"`
    );
    await queryRunner.query(`DROP INDEX "IDX_1a210fa5d08ed65fc06c900caa"`);
    await queryRunner.query(`DROP INDEX "IDX_5ecea7fb2f4a99587daa7a9123"`);
    await queryRunner.query(`DROP TABLE "lesson_students_user"`);
    await queryRunner.query(`DROP TABLE "checkpoint"`);
    await queryRunner.query(`DROP TABLE "step"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "dependency"`);
    await queryRunner.query(`DROP TABLE "code_module"`);
  }
}
