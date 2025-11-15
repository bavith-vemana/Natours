/* eslint-disable */

const nodemailer = require('nodemailer');
const AppError = require('./appError');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const juice = require('juice');
const fs = require('fs');
module.exports = class Email {
  constructor(user, url) {
    //initilization
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.link = url;
    this.user = user;
    this.from = 'Bavith Vemana <vemanabavith111@gmail.com>';
  }
  newTransporter() {
    //create and return transporter
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'e0661fac5d7d84',
        pass: 'fe0ef30e847775',
      },
    });
    return transporter;
  }

  async send(subject, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText(html),
    };
    const transporter = this.newTransporter();
    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.error('Error sending email:', err);
    //     return reject(err); // Reject instead of using res
    //   }
    // });
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('❌ Error sending email:', err.message);
          return reject(err); // reject only works inside Promise
        }
        console.log('✅ Email sent successfully:', info.response);
        resolve(info);
      });
    });
  }
  async sendPasswordResetMail() {
    //crete and save token
    const resetToken = this.user.createPasswordResetToken();
    await this.user.save({ validateBeforeSave: false });

    //Link to post new password
    const resetURL = `${this.link}/resetPassword/${resetToken}`;

    //Converting Pug to HTML
    const tempHtml = pug.renderFile(
      `${__dirname}/../views/email/passwordResetMail.pug`,
      {
        firstName: this.firstName,
        url: resetURL,
      },
    );
    //Injecting CSS
    const cssPath = `${__dirname}/../views/email/email.css`;
    const css = fs.readFileSync(cssPath, 'utf-8');
    const html = juice.inlineContent(tempHtml, css);

    // Expired time
    const URLExpiredTime = new Date(
      Date.now() + 10 * 60 * 1000,
    ).toLocaleString();

    //Subject
    const subject = `Link will valid till 10 min only that is upto ${URLExpiredTime}`;
    await this.send(subject, html);
  }
};
