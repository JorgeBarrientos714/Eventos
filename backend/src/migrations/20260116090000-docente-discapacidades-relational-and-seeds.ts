import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocenteDiscapacidadesRelationalAndSeeds20260116090000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla relacional DOCENTE - DISCAPACIDADES
    await queryRunner.query(`
      CREATE TABLE "NET_DOCENTE_DISCAPACIDADES" (
        "ID_PERSONA" NUMBER NOT NULL ENABLE,
        "ID_DISCAPACIDAD" NUMBER NOT NULL ENABLE,
        CONSTRAINT "PK_NET_DOCENTE_DISCAPACIDADES" PRIMARY KEY ("ID_PERSONA","ID_DISCAPACIDAD")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "NET_DOCENTE_DISCAPACIDADES" ADD CONSTRAINT "FK_DD_DOCENTE" FOREIGN KEY ("ID_PERSONA") REFERENCES "NET_DOCENTE" ("ID_PERSONA")
    `);
    await queryRunner.query(`
      ALTER TABLE "NET_DOCENTE_DISCAPACIDADES" ADD CONSTRAINT "FK_DD_DISCAPACIDAD" FOREIGN KEY ("ID_DISCAPACIDAD") REFERENCES "NET_DISCAPACIDADES" ("ID_DISCAPACIDAD")
    `);

    // Migrar datos existentes desde NET_DOCENTE.ID_DISCAPACIDAD
    await queryRunner.query(`
      INSERT INTO "NET_DOCENTE_DISCAPACIDADES"("ID_PERSONA","ID_DISCAPACIDAD")
      SELECT "ID_PERSONA","ID_DISCAPACIDAD" FROM "NET_DOCENTE" WHERE "ID_DISCAPACIDAD" IS NOT NULL
    `);

    // Eliminar FK, índice y columna antigua en NET_DOCENTE
    await queryRunner.query(`
      ALTER TABLE "NET_DOCENTE" DROP CONSTRAINT "FK_DOCENTE_DISCAPACIDAD"
    `);
    await queryRunner.query(`
      DROP INDEX "IDX_DOCENTE_DISCAPACIDAD"
    `);
    await queryRunner.query(`
      ALTER TABLE "NET_DOCENTE" DROP COLUMN "ID_DISCAPACIDAD"
    `);

    // ==================== SEEDS: NET_AREAS ====================
    await queryRunner.query(`
      INSERT INTO "NET_AREAS" ("NOMBRE_AREA") VALUES ('GERIATRIA')
    `);
    await queryRunner.query(`
      INSERT INTO "NET_AREAS" ("NOMBRE_AREA") VALUES ('TERAPIA OCUPACIONAL')
    `);
    await queryRunner.query(`
      INSERT INTO "NET_AREAS" ("NOMBRE_AREA") VALUES ('PSICOLOGIA')
    `);

    // ==================== SEEDS: NET_DISCAPACIDADES ====================
    await queryRunner.query(`
      INSERT INTO "NET_DISCAPACIDADES" ("NOMBRE", "DESCRIPCION") VALUES ('Discapacidad Física (Motora)', 'Limitaciones en el movimiento, afecta caminar, extremidades y actividades físicas')
    `);
    await queryRunner.query(`
      INSERT INTO "NET_DISCAPACIDADES" ("NOMBRE", "DESCRIPCION") VALUES ('Discapacidad Sensorial (Visual)', 'Disminución o pérdida de la capacidad para ver')
    `);
    await queryRunner.query(`
      INSERT INTO "NET_DISCAPACIDADES" ("NOMBRE", "DESCRIPCION") VALUES ('Discapacidad Sensorial (Auditiva)', 'Disminución o pérdida de la capacidad para oír')
    `);
    await queryRunner.query(`
      INSERT INTO "NET_DISCAPACIDADES" ("NOMBRE", "DESCRIPCION") VALUES ('Discapacidad Cognitiva', 'Dificultades en el funcionamiento intelectual y habilidades de aprendizaje, memoria y resolución de problemas')
    `);

    // ==================== SEEDS: NET_GRUPO_ETNICO ====================
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Mestizos (Ladinos)')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Lencas')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Maya-Chortí')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Misquitos (Miskitus)')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Tolupanes (Xicaques o Jicaques)')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Pech (o Pesh)')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Tawahkas')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Nahuas')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Garífunas')`);
    await queryRunner.query(`INSERT INTO "NET_GRUPO_ETNICO" ("NOMBRE_GRUPO_ETNICO") VALUES ('Isleños / Creoles de habla inglesa')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar columna en NET_DOCENTE
    await queryRunner.query(`
      ALTER TABLE "NET_DOCENTE" ADD ("ID_DISCAPACIDAD" NUMBER)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_DOCENTE_DISCAPACIDAD" ON "NET_DOCENTE" ("ID_DISCAPACIDAD")
    `);
    await queryRunner.query(`
      ALTER TABLE "NET_DOCENTE" ADD CONSTRAINT "FK_DOCENTE_DISCAPACIDAD" FOREIGN KEY ("ID_DISCAPACIDAD") REFERENCES "NET_DISCAPACIDADES" ("ID_DISCAPACIDAD")
    `);

    // Copiar un valor de discapacidad (si existe) desde la tabla relacional hacia la columna (elige la menor ID)
    await queryRunner.query(`
      UPDATE "NET_DOCENTE" d SET d."ID_DISCAPACIDAD" = (
        SELECT MIN(dd."ID_DISCAPACIDAD") FROM "NET_DOCENTE_DISCAPACIDADES" dd WHERE dd."ID_PERSONA" = d."ID_PERSONA"
      )
    `);

    // Eliminar la tabla relacional
    await queryRunner.query(`
      DROP TABLE "NET_DOCENTE_DISCAPACIDADES"
    `);

    // Borrar seeds insertados
    await queryRunner.query(`DELETE FROM "NET_AREAS" WHERE "NOMBRE_AREA" IN ('GERIATRIA','TERAPIA OCUPACIONAL','PSICOLOGIA')`);
    await queryRunner.query(`DELETE FROM "NET_DISCAPACIDADES" WHERE "NOMBRE" IN ('Discapacidad Física (Motora)','Discapacidad Sensorial (Visual)','Discapacidad Sensorial (Auditiva)','Discapacidad Cognitiva')`);
    await queryRunner.query(`DELETE FROM "NET_GRUPO_ETNICO" WHERE "NOMBRE_GRUPO_ETNICO" IN ('Mestizos (Ladinos)','Lencas','Maya-Chortí','Misquitos (Miskitus)','Tolupanes (Xicaques o Jicaques)','Pech (o Pesh)','Tawahkas','Nahuas','Garífunas','Isleños / Creoles de habla inglesa')`);
  }
}
