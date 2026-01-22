import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNetRegionalAndSeeds20260119123000 implements MigrationInterface {
  name = 'FixNetRegionalAndSeeds20260119123000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar FK errónea: ID_REGIONAL → NET_MUNICIPIO(ID_MUNICIPIO)
    // El nombre exacto del constraint proviene del DDL proporcionado.
    try {
      await queryRunner.query(`ALTER TABLE "NET_REGIONAL" DROP CONSTRAINT "FK_2b06af169bfc86e7de4c35d6ffa"`);
    } catch (e) {
      // Ignorar si ya no existe
    }

    // Asegurar tabla sin columnas extra (no se requieren cambios de columnas aquí)

    // Semillas de regionales
    const regionales = [
      'Occidental',
      'Noroccidental',
      'Nororiental',
      'CentroOcidental',
      'Centro Oriental',
      'region sur',
    ];

    for (const nombre of regionales) {
      await queryRunner.query(
        `INSERT INTO "NET_REGIONAL" ("NOMBRE_REGIONAL") VALUES (:nombre)`,
        [nombre],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Borrar semillas insertadas
    await queryRunner.query(`DELETE FROM "NET_REGIONAL" WHERE "NOMBRE_REGIONAL" IN (
      'Occidental','Noroccidental','Nororiental','CentroOcidental','Centro Oriental','region sur'
    )`);

    // No se restablece la FK errónea en el down.
  }
}
