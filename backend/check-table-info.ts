import { AppDataSource } from './ormconfig';

(async () => {
  const ds = await AppDataSource.initialize();
  const schema = String((AppDataSource.options as any).schema || (AppDataSource.options as any).username || '').toUpperCase();

  const tables = await ds.query(
    `select owner, table_name from all_tables where table_name = 'NET_EVENTOS' and owner = '${schema}'`,
  );
  const migs = await ds.query(
    `select owner, table_name from all_tables where table_name = '${(AppDataSource.options as any).migrationsTableName || 'MIGRATIONS'}' and owner = '${schema}'`,
  );
  const cols = await ds.query(
    `select owner, column_name from all_tab_columns where table_name = 'NET_EVENTOS' and owner = '${schema}' and column_name like 'IMAGEN%' order by column_id`,
  );
  console.log('net_eventos tables', tables);
  console.log('migrations tables', migs);
  console.log('imagen cols', cols);
  await ds.destroy();
})();
