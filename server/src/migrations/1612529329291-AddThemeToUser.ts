import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThemeToUser1612529329291 implements MigrationInterface {
  name = 'AddThemeToUser1612529329291';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_theme_enum" AS ENUM('Active4D', 'All Hallows Eve', 'Amy', 'Birds of Paradise', 'Blackboard', 'Brilliance Black', 'Brilliance Dull', 'Chrome DevTools', 'Clouds Midnight', 'Clouds', 'Cobalt', 'Dawn', 'Dreamweaver', 'Eiffel', 'Espresso Libre', 'GitHub', 'IDLE', 'Katzenmilch', 'Kuroir Theme', 'LAZY', 'MagicWB (Amiga)', 'Merbivore Soft', 'Merbivore', 'Monokai Bright', 'Monokai', 'Night Owl', 'Oceanic Next', 'Pastels on Dark', 'Slush and Poppies', 'Solarized-dark', 'Solarized-light', 'SpaceCadet', 'Sunburst', 'Textmate (Mac Classic)', 'Tomorrow-Night-Blue', 'Tomorrow-Night-Bright', 'Tomorrow-Night-Eighties', 'Tomorrow-Night', 'Tomorrow', 'Twilight', 'Upstream Sunburst', 'Vibrant Ink', 'Xcode_default', 'Zenburnesque', 'iPlastic', 'idleFingers', 'krTheme', 'monoindustrial')`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "theme" "user_theme_enum" DEFAULT 'Cobalt'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "theme"`);
    await queryRunner.query(`DROP TYPE "user_theme_enum"`);
  }
}
