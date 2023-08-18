/**
 * @module services/Email
 */
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const { inline: inlineCss } = require("css-inline");
const fs = require("fs");
const path = require("path");

const { google } = require("googleapis");

const { OAuth2 } = google.auth;

const clientId = config.get("emailCredentials.OAuth.clientId");
const clientSecret = config.get("emailCredentials.OAuth.clientSecret");
const refreshToken = config.get("emailCredentials.OAuth.refreshToken");

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      `${clientId}`,
      `${clientSecret}`,
      "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "no-reply@strainbra.in",
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    return transporter;
  } catch (error) {
    return false;
  }
};

/**
 * Send email
 * @param {string} subject
 * @param {string} body
 * @param {string} to
 * @param {string} attachments
 * @param {string} cc
 * @param {string} bcc
 */
const sendMail = async (
  subject = "",
  body = "",
  to = "",
  replyTo = "",
  attachments = [],
  cc = [],
  bcc = []
) => {
  try {
    const mailOptions = {
      from: "StrainBrain <no-reply@strainbra.in>",
      to: to.toLowerCase(),
      cc,
      bcc,
      subject,
      attachments,
      text: body,
      replyTo: replyTo.toLowerCase(),
    };

    const emailTransporter = await createTransporter();
    return emailTransporter.sendMail(mailOptions);
  } catch (error) {
    return Promise.reject(error);
  }
};

const sendHtmlMail = async ({
  subject = "",
  body = "",
  htmlFilePath = "",
  handleBarsReplacements = {},
  to = [],
  attachments = [],
  cc = [],
  bcc = [],
}) => {
  try {
    const filePath = path.join(__dirname, htmlFilePath);
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const htmlWithInlineCss = inlineCss(source, { remove_style_tags: true });

    const template = handlebars.compile(htmlWithInlineCss);
    const htmlToSend = template(handleBarsReplacements);
    const mailOptions = {
      from: "StrainBrain <no-reply@strainbra.in>",
      to: `${to}`,
      subject,
      html: htmlToSend,
      cc,
      bcc,
      attachments,
      text: body,
    };

    const emailTransporter = await createTransporter();
    return emailTransporter.sendMail(mailOptions);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  sendMail,
  sendHtmlMail,
};
