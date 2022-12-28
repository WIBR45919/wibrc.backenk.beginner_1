import { hash, compare } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";

import { USER_FIELDS_TO_EXTRACT } from "../../extractCode/User.extractCode";
import { UserDTO } from "../../../types";

type USER_KEYS = keyof UserDTO;
const SALBOUND = 10;
const JWT_KEY = "49U3Z16Plt$VoG2JZkm^9O*$wEBDeQt|@XK1_La/eE]Wt-[tnclANZ";

export const getFieldsByFieldToExtractBy = (code: USER_FIELDS_TO_EXTRACT): USER_KEYS[] => {
  if (code === USER_FIELDS_TO_EXTRACT.CODE_1) return ["email", "username"];
  if (code === USER_FIELDS_TO_EXTRACT.CODE_2)
    return ["uid", "email", "username", "dateNaiss", "status", "image", "password"];
  return ["status"];
};

export const hashPassword = async (password: string): Promise<string> => await hash(password, SALBOUND);

export const comparePassword = async (passwordToCompared: string, password: string): Promise<boolean> =>
  await compare(passwordToCompared, password);

type Payload = {
  id: string;
  profile: {
    username: string;
    email: string;
    role: string;
  };
};

export const generateToken = (payload: Payload): string =>
  sign(payload, process.env.JWT_KEY || JWT_KEY, {
    algorithm: "HS512",
    expiresIn: "1h",
  });

export const checkToken = (token: string): Payload | null | string => {
  let parsedToken: Payload | null = null;
  verify(token, JWT_KEY, (err, parsed) => {
    if(err) {
      switch(err.name) {
        case "TokenExpiredError":
          return "Token has expired";
          break;
       case "JsonWebTokenError":
          return "Invalid token";
          break;
       case "NotBeforeError":
          return "Token is not active";
          break;
          default: "Other Error"
          break;
     }
    } else parsedToken = parsed as Payload;
  })
  return parsedToken;
}