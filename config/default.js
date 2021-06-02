const path = require('path');
require('dotenv').config()

module.exports = {
  port: 3000,
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  },
  mongodb: {
    debug: true,
    uri: process.env.MONGODB_URI,
  },
  server: {
    site: {
      host: 'http://localhost',
      port: 3000,
    }
  },
  providers: {
    github: {
      appId: process.env.GITHUB_APP_ID,
      appSecret: process.env.GITHUB_APP_SECRET,
      passportOptions: {
        scope: ['user:email']
      }
    },
  },
  mailer: {
    transport: 'mailgun',
    mailgun: {
      apiKey: process.env.MAILGUN_APIKEY,
      domain: process.env.MAILGUN_DOMAIN
    },
    senders:  {
      default:  {
        from: 'perfiliev2@yandex.ru',
        signature: '<em>С уважением,<br>Александр</em>'
      },
    }
  },
};
