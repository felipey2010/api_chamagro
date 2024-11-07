import express from "express";
import {
  checkUserCredentialByEmailController,
  loginController,
  loginWithNextAuthController,
  registerController,
  requestPasswordResetController,
  resetPasswordController,
  verifyPasswordResetRequestController,
  verifyTokenController,
} from "../../controllers/auth.controller";
import { validate } from "../../middlewares/validate";
import {
  credentialCheckSchema,
  loginSchema,
  passwordResetSchema,
  registerSchema,
  verifyTokenSchema,
} from "../../schema/auth.schema";

const router = express.Router();

router.route("/").post(validate(registerSchema), registerController);

router
  .route("/check-credential/:email")
  .get(validate(credentialCheckSchema), checkUserCredentialByEmailController);

router
  .route("/token/request-password-reset/:email")
  .get(validate(credentialCheckSchema), requestPasswordResetController);

router
  .route("/account/reset-password")
  .post(validate(passwordResetSchema), resetPasswordController);

router
  .route("/verify-token")
  .post(validate(verifyTokenSchema), verifyTokenController);

router
  .route("/verify-password-token")
  .post(validate(verifyTokenSchema), verifyPasswordResetRequestController);

router.post("/login", validate(loginSchema), loginController);

router
  .route("/user/:email")
  .get(validate(credentialCheckSchema), loginWithNextAuthController);

export = router;
