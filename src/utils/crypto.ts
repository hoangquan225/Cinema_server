import CryptoJS from 'crypto-js';
import { AES, Rabbit, RC4, RC4Drop, enc } from 'crypto-js';

const secret_key = 'TbEQb0TDG9D64Xt544xLFofSBmxtJ7l6';
const SECRET_KEY_JOIN_CLASS = "QLLH-2021";
export function encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, secret_key).toString();
}

export function decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, secret_key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const enCryptClientPass = (_clientPass: string): string => {
    return CryptoJS.AES.encrypt(_clientPass, SECRET_KEY_JOIN_CLASS).toString();
};

export const decryptClientPass = (_clientPass: string): string => {
    const bytes = CryptoJS.AES.decrypt(_clientPass, SECRET_KEY_JOIN_CLASS);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export function encodeSHA256Pass(userName: string, password: string) {
    try {
        const encode = CryptoJS.SHA256(`${password}_${userName}_${password}`).toString();
        return encode;
    } catch (error) {
        console.log('error ', error);
        return null;
    }
}

export function encodeSHA256Code(obj: any, key: string) {
    try {
        const encode = CryptoJS.SHA256(`${JSON.stringify(obj)}_${key}`).toString();
        return encode;
    } catch (error) {
        console.log('error ', error);
        return null;
    }
}

//------------------------------------------------------------

export type EncAlgorithm = 'AES' | 'Rabbit' | 'RC4' | 'RC4Drop' | 'SHA256' ;
export type Encryptation = {
  encrypt(value: string): string;
  decrypt(value: string): string;
};

const algorithms = {
  AES,
  Rabbit,
  RC4,
  RC4Drop,
};

export function getEncriptation(
  encAlgorithm: EncAlgorithm,
  secretKey: string,
): Encryptation {
  return {
    encrypt: (value: string): string => {
      return algorithms[encAlgorithm].encrypt(value, secretKey).toString();
    },
    decrypt: (value: string): string => {
      return algorithms[encAlgorithm]
        .decrypt(value, secretKey)
        .toString(enc.Utf8);
    },
  };
}

export class CryptoUtil {
  private static readonly UTF8 = CryptoJS.enc.Utf8;

  constructor() { }

  static encodeToBase64(inputString: string): string {
    try {
      const encodedWordArray = CryptoJS.enc.Utf8.parse(inputString);
      const base64String = CryptoJS.enc.Base64.stringify(encodedWordArray);
      return base64String;
    } catch (error) {
      console.error('Error encoding to base64:', error);
      throw new Error('Error encoding to base64');
    }
  }

  static decodeFromBase64(encodedString: string): string {
    try {
      const decodedWordArray = CryptoJS.enc.Base64.parse(encodedString);
      const decodedString = decodedWordArray.toString(CryptoUtil.UTF8);
      return decodedString;
    } catch (error) {
      console.error('Error decoding from base64:', error);
      throw new Error('Error decoding from base64');
    }
  }
}