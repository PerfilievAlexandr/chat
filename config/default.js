const path = require('path');

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
    uri: 'mongodb://localhost/users_app'
  },
  server: {
    site: {
      host: 'http://localhost',
      port: 3000,
    }
  },
  providers: {
    github: {
      appId: '13fc097bf61d636fc48c',
      appSecret: '6cdb11d767aa95e86a36420ac207165d946aaaff',
      passportOptions: {
        scope: ['user:email']
      }
    },
  },
  mailer: {
    transport: 'mailgun',
    mailgun: {
      apiKey: '***apiKey***',
      domain: '***domain***'
    },
    senders:  {
      default:  {
        from: 'perfiliev2@yandex.ru',
        signature: '<em>С уважением,<br>Александр</em>'
      },
    }
  },
};
