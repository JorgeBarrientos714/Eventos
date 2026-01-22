import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMoreGeriatriaClases20260116100500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const areaSql = `(SELECT "ID_AREA" FROM "NET_AREAS" WHERE "NOMBRE_AREA"='GERIATRIA')`;
    const nombres = [
      'Brigadas de Salud Jesus de Otoro',
      'Brigadas de Salud El Paraiso',
      'Brigadas de Salud Nacaome',
      'Brigadas de Salud Choluteca',
      'Brigadas de Salud Catacamas Y Talanga',
      'Jornada Literaria',
      'Premio Toribio'
    ];
    for (const nombre of nombres) {
      const safe = nombre.replace(/'/g, "''");
      await queryRunner.query(`INSERT INTO "NET_CLASES" ("NOMBRE_CLASE","ID_AREA") VALUES ('${safe}', ${areaSql})`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nombres = [
      'Brigadas de Salud Jesus de Otoro',
      'Brigadas de Salud El Paraiso',
      'Brigadas de Salud Nacaome',
      'Brigadas de Salud Choluteca',
      'Brigadas de Salud Catacamas Y Talanga',
      'Jornada Literaria',
      'Premio Toribio'
    ];
    for (const nombre of nombres) {
      const safe = nombre.replace(/'/g, "''");
      await queryRunner.query(`DELETE FROM "NET_CLASES" WHERE "NOMBRE_CLASE"='${safe}'`);
    }
  }
}
