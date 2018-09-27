export function getDatabaseConfiguration() {
  return {
    host: process.env.FINDA_DB_HOST,
    user: process.env.FINDA_DB_USER,
    password: process.env.FINDA_DB_PASSWORD,
    database: process.env.FINDA_DB_DATABASE,
    port: Number(process.env.FINDA_DB_PORT),
  };
}
