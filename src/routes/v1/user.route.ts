import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserByEmailController,
  getUserController,
  getUsersController,
  updateUserController,
  updateUserPhotoController,
} from "../../controllers/user.controller";

import { validate } from "../../middlewares/validate";
import {
  queryUserEmailSchema,
  queryUserSchema,
  queryUsersSchema,
  updateUserSchema,
  userRegistrationSchema,
} from "../../schema/user.schema";

const router = express.Router();

router
  .route("/")
  .post(validate(userRegistrationSchema), createUserController)
  .get(
    // auth('getUsers'),
    validate(queryUsersSchema),
    getUsersController,
  );

router
  .route("/:userId")
  .get(validate(queryUserSchema), getUserController)
  .patch(validate(updateUserSchema), updateUserController)
  .delete(validate(queryUserSchema), deleteUserController);

router.route("/user/:userId").post(updateUserPhotoController);

router
  .route("/email/:email")
  .get(validate(queryUserEmailSchema), getUserByEmailController);

export = router;
