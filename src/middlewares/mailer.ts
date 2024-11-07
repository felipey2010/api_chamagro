import * as nodemailer from "nodemailer";
import { google } from "googleapis";
import config from "../config/config";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const oAuth2Client = new google.auth.OAuth2(
  config.smtp.id,
  config.smtp.secret,
  config.smtp.redirectUrl,
);

oAuth2Client.setCredentials({ refresh_token: config.smtp.refreshToken });

async function sendMail({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    if (typeof accessToken.token !== "string") {
      throw new Error("Failed to obtain access token");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.smtp.user,
        clientId: config.smtp.id,
        clientSecret: config.smtp.secret,
        refreshToken: config.smtp.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `MentorConnect API <${config.smtp.user}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export { sendMail };
