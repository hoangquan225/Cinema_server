import { CookieOptions } from 'express';
import dotenv from './dotenv';
import { COOKIE_EXPIRED } from './constant';
dotenv.config();

// export const getCookieOptions = (maxAge: number = 31536000000) => {
export const getCookieOptions = (
  expires = new Date(Date.now() + COOKIE_EXPIRED * 24 * 60 * 60 * 1000),
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
