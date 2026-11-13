import { Client } from 'pg';

const candidates = [
  'postgres://postgres:postgres@127.0.0.1:5432/vitauto_proto',
  'postgres://postgres:postgres@127.0.0.1:5432/postgres',
  'postgres://postgres@127.0.0.1:5432/postgres',   // без пароля (trust)
];

for (const url of candidates) {
  const masked = url.replace(/:[^@\/]*@/, ':***@');
  const c = new Client({ connectionString: url });
  try {
    await c.connect();
    const r = await c.query('select current_database() db, current_user usr, version() ver');
    console.log('✓', masked);
    console.log('  db=', r.rows[0].db, 'user=', r.rows[0].usr);
    console.log('  ', r.rows[0].ver.split(',')[0]);
    await c.end();
    break;
  } catch (e: any) {
    console.log('✗', masked, '→', e.code ?? e.message);
    await c.end().catch(() => {});
  }
}