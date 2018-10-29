export function getDatabaseConfiguration() {
  console.log('process.env', process.env);
  console.log({
    host: process.env.RAYON_DB_HOST,
    user: process.env.RAYON_DB_USER,
    password: process.env.RAYON_DB_PASSWORD,
    database: process.env.RAYON_DB_DATABASE,
    port: Number(process.env.RAYON_DB_PORT),
  });
  return {
    host: process.env.RAYON_DB_HOST,
    user: process.env.RAYON_DB_USER,
    password: process.env.RAYON_DB_PASSWORD,
    database: process.env.RAYON_DB_DATABASE,
    port: Number(process.env.RAYON_DB_PORT),
  };
}
