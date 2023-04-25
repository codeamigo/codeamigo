import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1682385786665 implements MigrationInterface {
    name = 'Initial1682385786665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" text DEFAULT 'USER', "profilePic" character varying, "githubId" text, "googleId" text, "username" text NOT NULL, "email" text, "password" text, CONSTRAINT "UQ_0d84cc6a830f0e4ebbfcd6381dd" UNIQUE ("githubId"), CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "code_module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "isEntry" boolean, "code" character varying NOT NULL, "stepId" uuid, "userId" uuid, CONSTRAINT "PK_2f27e8cca5d582e82fabeb997c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" text, "slug" text, "description" character varying, "thumbnail" character varying, "views" integer DEFAULT '0', "likes" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_19967be71e1113334304a55fa63" UNIQUE ("title"), CONSTRAINT "UQ_db1819e1834a90ab442530d7c2c" UNIQUE ("slug"), CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying, "stepId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "step" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "slug" character varying, "instructions" character varying NOT NULL, "isCompleted" boolean, "position" integer, "start" character varying, "lessonId" uuid, CONSTRAINT "PK_70d386ace569c3d265e05db0cc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checkpoint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL DEFAULT '', "isCompleted" boolean NOT NULL DEFAULT false, "isTested" boolean NOT NULL DEFAULT false, "type" text NOT NULL DEFAULT 'spec', "matchRegex" character varying, "fileToMatchRegex" character varying, "output" character varying, "test" character varying, "moduleId" character varying, "stepId" uuid, "userId" uuid, CONSTRAINT "PK_fea86db187949398f8b614f730a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lesson_users_user" ("lessonId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_8b171f8975ffec63c490938a83c" PRIMARY KEY ("lessonId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5fea17f3ea912b2cafbb1e65f6" ON "lesson_users_user" ("lessonId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b085ea6f0570114685cedab8a" ON "lesson_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "code_module" ADD CONSTRAINT "FK_132fec4426468f2c89c5b8a3c7d" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD CONSTRAINT "FK_3126c366bff35466d2fd0969286" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_7fdf334f45b9123f59612d9cf9e" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step" ADD CONSTRAINT "FK_3f4cb6fe244ff0714645ce3d6f8" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD CONSTRAINT "FK_82f585669590939ffd632480aaa" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD CONSTRAINT "FK_54b53238a8279826f95be669f8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "FK_5fea17f3ea912b2cafbb1e65f60" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "FK_9b085ea6f0570114685cedab8a3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "FK_9b085ea6f0570114685cedab8a3"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "FK_5fea17f3ea912b2cafbb1e65f60"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP CONSTRAINT "FK_54b53238a8279826f95be669f8d"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP CONSTRAINT "FK_82f585669590939ffd632480aaa"`);
        await queryRunner.query(`ALTER TABLE "step" DROP CONSTRAINT "FK_3f4cb6fe244ff0714645ce3d6f8"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_7fdf334f45b9123f59612d9cf9e"`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP CONSTRAINT "FK_3126c366bff35466d2fd0969286"`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP CONSTRAINT "FK_132fec4426468f2c89c5b8a3c7d"`);
        await queryRunner.query(`DROP INDEX "IDX_9b085ea6f0570114685cedab8a"`);
        await queryRunner.query(`DROP INDEX "IDX_5fea17f3ea912b2cafbb1e65f6"`);
        await queryRunner.query(`DROP TABLE "lesson_users_user"`);
        await queryRunner.query(`DROP TABLE "checkpoint"`);
        await queryRunner.query(`DROP TABLE "step"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP TABLE "code_module"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
