require('dotenv').config();
const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_SSH_OPTIONS } = process.env;
if ([DEPLOY_USER, DEPLOY_HOST, DEPLOY_SSH_OPTIONS].some(val => typeof val === 'undefined')) {
  throw new Error([
    'Enviroments variable(s) not set - Please make sure enviroment variables following are set',
    '`DEPLOY_USER`, `DEPLOY_HOST`, `DEPLOY_SSH_OPTIONS` '
  ].join('\n'))
}

console.log({ DEPLOY_USER, DEPLOY_HOST, DEPLOY_SSH_OPTIONS })

module.exports = {
  apps: [{
    name: 'API',
    script: 'lib/node-server/src/main/controller/RayonNodeServerApp.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      ENV_BLOCKCHAIN: 'ropsten',
    }
  }],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ssh_options: DEPLOY_SSH_OPTIONS,
      ref: 'origin/master',
      repo: 'https://github.com/rayonprotocol/rayonprotocol-admin.git',
      path: '/var/www/rayonprotocol-admin/production',
      'pre-setup': "apt-get install git ; ls -la",
      'post-deploy': 'cd node-server && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
