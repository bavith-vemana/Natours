// /* eslint-disable */

// const nodemailer = require('nodemailer');
// const AppError = require('./appError');
// const pug = require('pug');
// const { htmlToText } = require('html-to-text');
// const juice = require('juice');
// const fs = require('fs');
// module.exports = class Email {
//   constructor(user, url) {
//     //initilization
//     this.firstName = user.name.split(' ')[0];
//     this.to = user.email;
//     this.link = url;
//     this.user = user;
//     this.from = 'Bavith Vemana <bavithprojects@gmail.com>';
//   }
//   newTransporter() {
//     //create and return transporter
//     const transporter = nodemailer.createTransport({
//       host: 'smtp-relay.brevo.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: '9bb0b7001@smtp-brevo.com',
//         pass: 'vdMsGOB64XQkI30U',
//       },
//     });
//     return transporter;
//   }

//   async send(subject, html) {
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject: subject,
//       html: html,
//       text: htmlToText(html),
//     };
//     const transporter = this.newTransporter();
//     // transporter.sendMail(mailOptions, (err, info) => {
//     //   if (err) {
//     //     console.error('Error sending email:', err);
//     //     return reject(err); // Reject instead of using res
//     //   }
//     // });
//     return new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//           console.error('❌ Error sending email:', err.message);
//           return reject(err); // reject only works inside Promise
//         }
//         console.log('✅ Email sent successfully:', info.response);
//         resolve(info);
//       });
//     });
//   }
//   async sendPasswordResetMail() {
//     //crete and save token
//     const resetToken = this.user.createPasswordResetToken();
//     await this.user.save({ validateBeforeSave: false });

//     //Link to post new password
//     const resetURL = `${this.link}/resetPassword/${resetToken}`;

//     //Converting Pug to HTML
//     const tempHtml = pug.renderFile(
//       `${__dirname}/../views/email/passwordResetMail.pug`,
//       {
//         firstName: this.firstName,
//         url: resetURL,
//       },
//     );
//     //Injecting CSS
//     const cssPath = `${__dirname}/../views/email/email.css`;
//     const css = fs.readFileSync(cssPath, 'utf-8');
//     const html = juice.inlineContent(tempHtml, css);
//     //const html = `<p>Reset your password by clicking <a href="${resetURL}">here</a>.</p>`;

//     // Expired time
//     const URLExpiredTime = new Date(
//       Date.now() + 10 * 60 * 1000,
//     ).toLocaleString();

//     //Subject
//     const subject = `Link will valid till 10 min only that is upto ${URLExpiredTime}`;
//     await this.send(subject, html);
//   }
// };
/* eslint-disable */

const AppError = require('./appError');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const juice = require('juice');
const fs = require('fs');
const { Resend } = require('resend');

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.link = url;
    this.user = user;
    this.from = 'Bavith <onboarding@resend.dev>'; // Sender must be resend.dev or a verified domain

    this.resend = new Resend('re_Q1PXdGwK_9ogtyBuU1d5JLUdbzg4YPfaP');
  }

  async send(subject, html) {
    try {
      const text = htmlToText(html);

      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: this.to,
        subject,
        html,
        text,
      });

      if (error) {
        console.log('❌ Resend error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Email sent:', data);
    } catch (err) {
      console.error('❌ Failed to send email:', err);
      throw new AppError('Email sending failed', 500);
    }
  }

  async sendPasswordResetMail() {
    // generate token
    const resetToken = this.user.createPasswordResetToken();
    await this.user.save({ validateBeforeSave: false });

    // create reset URL
    const resetURL = `${this.link}/resetPassword/${resetToken}`;

    // Render PUG to HTML
    const tempHtml = pug.renderFile(
      `${__dirname}/../views/email/passwordResetMail.pug`,
      {
        firstName: this.firstName,
        url: resetURL,
      },
    );

    // Inline CSS
    const css = fs.readFileSync(
      `${__dirname}/../views/email/email.css`,
      'utf-8',
    );
    const html = juice.inlineContent(tempHtml, css);

    // Expire time
    const URLExpiredTime = new Date(
      Date.now() + 10 * 60 * 1000,
    ).toLocaleString();

    const subject = `Link is valid for 10 minutes (until ${URLExpiredTime})`;

    await this.send(subject, html);
  }
};
