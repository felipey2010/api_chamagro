import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { getUserByIdService } from "../services/user.service";
import config from "./config";
import { TOKEN_TYPES } from "./tokens";

interface Payload {
  sub: string;
  type: string;
  iat: number;
  exp: number;
}

const jwtOptions: StrategyOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: Payload, done: VerifiedCallback) => {
  try {
    if (payload.type !== TOKEN_TYPES.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await getUserByIdService(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
