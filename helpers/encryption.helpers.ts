import CryptoJS from "crypto-js";

type AlgorithmType = "AES" | "TripleDES" | "SHA256" | "SHA512" | "MD5";

export const encryption = {
  // ==============================>
  // ## Encryption data 
  // ==============================>
  set: (data: any, key = process.env.NEXT_PUBLIC_COOKIE_KEY || "", algorithm: AlgorithmType = "AES") => {
    const text  =  typeof data  ===  "string" ? data : JSON.stringify(data);

    let encrypted: string;

    switch (algorithm) {
      case "AES"        :  encrypted = CryptoJS.AES.encrypt(text, key).toString();         break;
      case "TripleDES"  :  encrypted = CryptoJS.TripleDES.encrypt(text, key).toString();   break;
      case "SHA256"     :  encrypted = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);   break;
      case "SHA512"     :  encrypted = CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);   break;
      case "MD5"        :  encrypted = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);      break;
      default           :  throw new Error(`Unsupported algorithm: ${algorithm}`);
      
    }

    if (["SHA256", "SHA512", "MD5"].includes(algorithm)) return encrypted;

    const encData  =  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    
    return encData;
  },

  // ==============================>
  // ## Decryption data 
  // ==============================>
  get: (data: string, key = process.env.NEXT_PUBLIC_COOKIE_KEY || "", algorithm: AlgorithmType = "AES") => {
    if (["SHA256", "SHA512", "MD5"].includes(algorithm)) throw new Error(`${algorithm} is a one-way hash and cannot be decrypted.`);

    const decData  =  CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);

    let decrypted: string;

    switch (algorithm) {
      case "AES"        :  decrypted = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8);         break;
      case "TripleDES"  :  decrypted = CryptoJS.TripleDES.decrypt(decData, key).toString(CryptoJS.enc.Utf8);   break;
      default           :  throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }
}