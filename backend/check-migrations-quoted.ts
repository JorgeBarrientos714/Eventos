import { AppDataSource } from './ormconfig';
(async () => {
  const ds = await AppDataSource.initialize();
  try {
    const r = await ds.query('SELECT * FROM "migrations" ORDER BY "id" DESC');
    console.log('migrations rows:', r);
  } catch (e) {
    console.error('error querying "migrations"', e.message);
  }
  await ds.destroy();
})();
