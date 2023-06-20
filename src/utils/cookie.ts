import { CookieOptions } from 'express';
import dotenv from './dotenv';
dotenv.config();

// export const getCookieOptions = (maxAge: number = 31536000000) => {
export const getCookieOptions = (
  expires = new Date(
    Date.now() + Number(process.env.COOKIE_EXPIRED) * 24 * 60 * 60 * 1000
  ),
  maxAge?: any
) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    expires,
    // maxAge,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  return cookieOptions;
};
