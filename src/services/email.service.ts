import { google } from "googleapis";
import httpStatus from "http-status";
import nodemailer from "nodemailer";
import config from "../config/config";
import logger from "../config/logger";
import { GeneralException } from "../exceptions/GeneralException";
import generateVerificationEmail from "../templates/account/verificationEmailTemplate";
import generatePasswordResetRequestEmail from "../templates/password/passwordResetRequestEmailTemplate";

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} template
 * @returns {Promise<void>}
 */
export async function sendEmail(to: string, subject: string, template: string) {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      config.smtp.id,
      config.smtp.secret,
      config.smtp.redirectUrl,
    );
    oAuth2Client.setCredentials({ refresh_token: config.smtp.refreshToken });
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      port: config.smtp.port,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.email.user,
        clientId: config.smtp.id,
        clientSecret: config.smtp.secret,
        refreshToken: config.smtp.refreshToken,
        accessToken: accessToken.token || "",
      },
    });
    /* istanbul ignore next */
    if (config.env !== "test") {
      transport
        .verify()
        .then(() => logger.info("Connected to email server"))
        .catch(() =>
          logger.warn(
            "Unable to connect to email server. Make sure you have configured the SMTP options in .env",
          ),
        );
    }

    transport.sendMail({
      from: config.email.from,
      to,
      subject,
      html: template,
    });
  } catch (error) {
    throw new GeneralException(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Erro ao enviar email",
    );
  }
}

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendVerificationEmail = async (to: string, token: string) => {
  const subject = "Verificação de email";
  const template = generateVerificationEmail(to, token);
  await sendEmail(to, subject, template);
};

/**
 * Send password request email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export const sendPasswordResetRequestEmail = async (
  to: string,
  name: string,
  token: string,
) => {
  const subject = "Redefinição de senha";
  const template = generatePasswordResetRequestEmail(name, token);
  await sendEmail(to, subject, template);
};
