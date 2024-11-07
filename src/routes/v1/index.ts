import express, { Request, Response } from "express"
import httpStatus from "http-status"
import { successResponse } from "../../middlewares/responseGenerator"
import authRoute from "./auth.route"
import chamadosRoute from "./chamados.route"
import userRoute from "./user.route"

const router = express.Router()

router.get("/", (req: Request, res: Response) =>
  successResponse(res, httpStatus.OK, "Hello world", null)
)

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/chamados",
    route: chamadosRoute,
  },
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export = router
