require('dotenv').config();

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_SSH_OPTIONS } = process.env;
const { RAYON_DB_HOST, RAYON_DB_USER, RAYON_DB_PASSWORD, RAYON_DB_DATABASE, RAYON_DB_PORT } = process.env;
module.exports = {
  apps: [
    {
      name: 'API',
      script: 'lib/node-server/src/main/controller/RayonNodeServerApp.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        ENV_BLOCKCHAIN: 'ropsten',
        APP_PORT: 8080,
        RAYON_DB_HOST,
        RAYON_DB_USER,
        RAYON_DB_PASSWORD,
        RAYON_DB_DATABASE,
        RAYON_DB_PORT,
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ssh_options: DEPLOY_SSH_OPTIONS,
      ref: 'origin/master',
      repo: 'https://github.com/rayonprotocol/rayonprotocol-admin.git',
      path: '/var/www/rayonprotocol-admin/production',
      'post-deploy': 'cd shared && yarn && cd ../node-server && yarn && yarn build && yarn pm2:reload',
    },
  },
};
