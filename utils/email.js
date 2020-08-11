const pug = require('pug');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Santosh Gupta <abingras@gmail.com>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      console.log(process.env.NODE_ENV);
      console.log(process.env.SENDGRID_USERNAME);
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(templete, subject) {
    //send actual mails
    const html = pug.renderFile(`${__dirname}/../views/email/${templete}.pug`, {
      firstName: this.firstName,
      subject: subject,
      url: this.url,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to natours family');
  }

  async sendResetMail() {
    await this.send(
      'passwordReset',
      'Reset your password(valid for 10 mins only)'
    );
  }
};
