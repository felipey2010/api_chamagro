import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import passport from "passport";
import config from "./config/config";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan";
import { jwtStrategy } from "./config/passport";
import { GeneralException } from "./exceptions/GeneralException";
import { errorConverter, errorHandler } from "./middlewares/error";
import routes from "./routes/v1";
const xss = require("xss-clean");

const app = express();

if (config.env !== "test") {
  app.use(morganSuccessHandler);
  app.use(morganErrorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());
// app.use(cors({
//   origin: ['http://localhost:3000']
// }))

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/api/v1/auth', authLimiter)
// }

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
const routeNotFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return new Promise((resolve, reject) => {
    try {
      next(new GeneralException(httpStatus.NOT_FOUND, "Rota não encontrada"));
      resolve("success");
    } catch (error) {
      reject(error);
    }
  });
};

app.use(async (req, res, next) => {
  try {
    await routeNotFoundHandler(req, res, next);
  } catch (error) {
    throw new GeneralException(httpStatus.NOT_FOUND, "Rota não encontrada");
  }
});

// convert error to GeneralException, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export = app;
