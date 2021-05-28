const nodemailer = require('nodemailer');
const juice = require('juice');
const config = require('config');
const mg = require('nodemailer-mailgun-transport');
const pug = require('pug');
const path = require('path');


const mailgunAuth = {
  auth: {
    api_key: config.get('mailer.mailgun.apiKey'),
    domain: config.get('mailer.mailgun.domain'),
  }
};

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));


module.exports = sendMail = async ({
    template = 'hello',
    subject,
    to,
    name,
    from,
    headers,
    link,
  }) => {
  const sender = config.mailer.senders[from || 'default'];
  const locals = { sender, name, link };

  const html = pug.renderFile(
    path.join(config.templatesRoot, 'email', template) + '.pug',
    locals
  );

  const message = {
    from: sender.from,
    html: juice(html),
    to,
    subject,
    headers: headers || {},
  };

  return await smtpTransport.sendMail(message);
};
