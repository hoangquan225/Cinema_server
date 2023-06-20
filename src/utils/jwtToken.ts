import { sign, verify } from 'jsonwebtoken';
// import { jwtSecret, TOKEN_EXPIRED } from '../constrain';

const { JWT_SECRET = 'appcinema_secret', TOKEN_EXPIRED } = process.env;

export type TokenData = {
  _id: string;
  iat?: number;
  exp?: number;
  from?: number;
};

export function jwtEncode(userId: any, expiresIn = Number(TOKEN_EXPIRED)) {
  const payload: TokenData = { _id: userId };

  return sign(payload, JWT_SECRET, { expiresIn });
}

export function jwtDecodeToken(token: string) {
  try {
    const decoded: any = verify(token, `${JWT_SECRET}`);
    return decoded;
  } catch (err) {
    return null;
  }
}
