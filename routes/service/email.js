"use strict";

let fs         = require("fs")
,   path       = require("path")
,   util       = require("util")
,   _          = require("lodash")
,   invariant  = require("invariant")
,   nodemailer = require("nodemailer")
,   Promise    = require("bluebird");

const SMTP_CONFIG = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "cramfordtest@gmail.com",
        pass: "cramfordtest123"
    }
};

let transporter = nodemailer.createTransport(SMTP_CONFIG);

/**
 * Sends an email with given params.
 * ''
 * @param  {String | Array} to the recipients
 * @param  {String} subject the subject
 * @param  {String} template the filename of the template
 * @param  {Array} formatParams the params used to populate the template
 * 
 * @return {Promise}
 */
function sendEmail(to, subject, template, formatParams) {
  
  return new Promise(function(resolve, reject) {
    
    if (_.isArray(to)) {
      to = to.join(", ");
    }
    
    let html = fs.readFileSync(path.join(__dirname, "email/templates", template));
    
    invariant(_.isString(to), `expects 'to' to be string, but get '${typeof to}'`);
    invariant(_.isString(subject), `expects 'subject' to be string, but get '${typeof subject}'`);
    
    let mailOptions = {
        from: "Cramford <cramfordtest@gmail.com>",
        to: "xinghu1989@gmail.com",
        subject: subject,
        html: html
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        reject(err);
      } else {
        resolve(info)
      }
    });
    
  });
  
}

let EmailApi = {
  
  /**
   * Sends an email upon user registeration using email.
   * 
   * @param {String} email the email to sent to.
   * @param {String} username the username.
   * 
   * @return {Promise}
   */
  sendLocalRegister: function(email, username) {
    return new Promise(function(resolve, reject) {
      sendEmail(email, "Welcome to Cramford", "localRegister.html", [username])
        .then(function() {
          resolve();          
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  
  /**
   * Sends an email upon user registeration using facebook.
   * 
   * @param {String} email the email to sent to.
   * 
   * @return {Promise}
   */
  sendFacebookRegister: function(email) {
    return new Promise(function(resolve, reject) {
      sendEmail(email, "Welcome to Cramford", "facebookRegister.html")
        .then(function() {
          resolve();          
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  
  /**
   * Sends an email with reset password link inside.
   *
   * @param {String} email the email to sent to.
   * @param {String} link the link for password reset.
   * 
   * @return {Promise} the new promise object.
   */
  sendResetPassword: function(email, link) {
    
    return new Promise(function(resolve, reject) {
      sendEmail(email, "Reset password", "resetPassword.html")
        .then(function() {
          resolve();          
        })
        .catch(function(err) {
          reject(err);
        });
    });

  },
  
  /**
   * Sends an email indicates that given email is not registered.
   * 
   * @param  {String} email the email to sent to.
   * 
   * @return {Promise} the new promise object.
   */
  sendUnregistered: function(email) {
    return new Promise(function(resolve, reject) {
      sendEmail(email, "Reset password", "unregistered.html")
        .then(function() {
          resolve();          
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }

};

module.exports = EmailApi;