import { config as dotenvConfig } from "dotenv";
import Joi from "joi";
import path from "path";

dotenvConfig({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(5000),
    POSTGRES_URL: Joi.string().required().description("Postgres database URL"),
    DB_LOCAL_URL: Joi.string().required().description("Local database URL"),
    JWT_SALTROUND: Joi.number().default(10),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("Access token expiration in minutes"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("Refresh token expiration in days"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Reset password token expiration in minutes"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("Verify email token expiration in minutes"),
    SMTP_HOST: Joi.string().description("SMTP server host"),
    SMTP_PORT: Joi.number().description("SMTP server port"),
    SMTP_USERNAME: Joi.string().description("SMTP server username"),
    SMTP_PASSWORD: Joi.string().description("SMTP server password"),
    EMAIL_FROM: Joi.string().description("Email from address"),
    OAUTH_CLIENT_ID: Joi.string().description("OAuth client ID"),
    OAUTH_CLIENT_SECRET: Joi.string().description("OAuth client secret"),
    OAUTH_REDIRECT_URI: Joi.string().description("OAuth redirect URI"),
    OAUTH_REFRESH_TOKEN: Joi.string().description("OAuth refresh token"),
    OAUTH_USER: Joi.string().description("OAuth user"),
    APPWRITE_ENDPOINT: Joi.string().description("Endpoint of Appwrite"),
    APPWRITE_PROJECT_ID: Joi.string().description("Project id of Appwrite"),
    APPWRITE_API_KEY: Joi.string().description("API key of Appwrite"),
    APPWRITE_BUCKET_ID: Joi.string().description("Bucket id"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV as string,
  port: envVars.PORT as number,
  db_url:
    envVars.NODE_ENV === "production"
      ? (envVars.POSTGRES_URL as string)
      : (envVars.DB_LOCAL_URL as string),
  jwt: {
    saltround: envVars.JWT_SALTROUND as number,
    secret: envVars.JWT_SECRET as string,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES as number,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS as number,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES as number,
    verifyEmailExpirationMinutes:
      envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES as number,
  },
  email: {
    user: envVars.SMTP_USERNAME as string,
    pass: envVars.SMTP_PASSWORD as string,
    from: envVars.EMAIL_FROM as string,
  },
  smtp: {
    id: envVars.OAUTH_CLIENT_ID as string,
    secret: envVars.OAUTH_CLIENT_SECRET as string,
    redirectUrl: envVars.OAUTH_REDIRECT_URI as string,
    refreshToken: envVars.OAUTH_REFRESH_TOKEN as string,
    user: envVars.OAUTH_USER as string,
    host: envVars.SMTP_HOST as string,
    port: envVars.SMTP_PORT as number,
  },
  APPWRITE_ENDPOINT: envVars.APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID: envVars.APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY: envVars.APPWRITE_API_KEY,
  APPWRITE_BUCKET_ID: envVars.APPWRITE_BUCKET_ID,
};

export default config;
