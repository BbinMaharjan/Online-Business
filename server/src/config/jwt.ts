import jwt, { SignOptions } from "jsonwebtoken";

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "jwt_access_secret_key";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "jwt_refresh_secret_key";
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export interface JwtPayloadInterface {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

const accessTokenOptions: SignOptions = { expiresIn: JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"] };
const refreshTokenOptions: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] };

export const signAccessToken = (payload: JwtPayloadInterface) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, accessTokenOptions);
};

export const signRefreshToken = (payload: JwtPayloadInterface) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): JwtPayloadInterface => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayloadInterface;
};

export const verifyRefreshToken = (token: string): JwtPayloadInterface => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayloadInterface;
};