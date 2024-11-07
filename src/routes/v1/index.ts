import express, { Request, Response } from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import { successResponse } from "../../middlewares/responseGenerator";
import httpStatus from "http-status";

const router = express.Router();

router.get("/", (req: Request, res: Response) =>
  successResponse(res, httpStatus.OK, "Hello world", null),
);

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export = router;
