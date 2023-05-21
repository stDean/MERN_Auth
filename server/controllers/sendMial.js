const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROND = "https://developers.google.com/oauthplayground";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SENDERS_EMAIL
} = process.env;

const oAuth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SENDERS_EMAIL
)

const sendMail = (to, url, txt) => {
  oAuth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
  })
  const accessToken = oAuth2Client.getAccessToken();
  const smtpTransort = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDERS_EMAIL,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  });

  const mailOption = {
    from: SENDERS_EMAIL,
    to: to,
    subject: "Welcome To Dean's Auth.",
    html: `
      <div style="max-width:700px; margin:auto; border:10px solid #ddd; padding: 50px 20px; font-size: 110%">
        <h2 style="text-align:center; text-transform: uppercase; color: teal;">
          Welcome to Dean Auth
        </h2>
        <p>Thank you for registering on Dean's Auth, Click the button below to activate account.</p>
        <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>

        <p>If button doesn't work for any reason, you can use the link below</p>
        <div>${url}</div>
      </div>
    `
  }

  smtpTransort.sendMail(mailOption, (err, info) => {
    if (err) return err;
    return info;
  })
}

module.exports = sendMail;