import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEventoEstado20260115121500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índice y columna ESTADO en NET_EVENTOS
    // El índice puede no existir si se creó en un entorno distinto; por seguridad usamos DROP INDEX directo.
    await queryRunner.query(`
      BEGIN
        EXECUTE IMMEDIATE 'DROP INDEX "IDX_EVENTO_ESTADO"';
      EXCEPTION
        WHEN OTHERS THEN
          IF SQLCODE != -1418 THEN -- ignorar error si el índice no existe
            RAISE;
          END IF;
      END;
    `);

    await queryRunner.query(`
      ALTER TABLE "NET_EVENTOS" DROP COLUMN "ESTADO"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar columna e índice
    await queryRunner.query(`
      ALTER TABLE "NET_EVENTOS" ADD ("ESTADO" VARCHAR2(20 BYTE))
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_EVENTO_ESTADO" ON "NET_EVENTOS" ("ESTADO")
    `);
  }
}
