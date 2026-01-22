import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdPaisDepartamento20260115123000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "NET_DEPARTAMENTO" ADD ("ID_PAIS" NUMBER)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_DEPARTAMENTO_PAIS" ON "NET_DEPARTAMENTO" ("ID_PAIS")
    `);
    await queryRunner.query(`
      ALTER TABLE "NET_DEPARTAMENTO" ADD CONSTRAINT "FK_DEPARTAMENTO_PAIS" FOREIGN KEY ("ID_PAIS") REFERENCES "NET_PAIS" ("ID_PAIS")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "NET_DEPARTAMENTO" DROP CONSTRAINT "FK_DEPARTAMENTO_PAIS"
    `);
    await queryRunner.query(`
      DROP INDEX "IDX_DEPARTAMENTO_PAIS"
    `);
    await queryRunner.query(`
      ALTER TABLE "NET_DEPARTAMENTO" DROP COLUMN "ID_PAIS"
    `);
  }
}
