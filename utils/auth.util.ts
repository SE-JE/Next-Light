import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import { encryption } from '@utils';

export const auth = {
  // ==============================>
  // ## Path of login page
  // ==============================>
  PATH_LOGIN                    :   '/auth/login',
  
  // ==============================>
  // ## Path of home page
  // ==============================>
  PATH_BASE                     :   '/',
  
  // ==============================>
  // ## Access token expired (days)
  // ==============================>
  ACCESS_TOKEN_EXPIRED          :   7,

  // ==============================>
  // ## Name of cookie access token
  // ==============================>
  ACCESS_TOKEN_NAME             :   String(process.env.NEXT_PUBLIC_APP_NAME || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '.user.token',

  // ==============================>
  // ## set access token to cookie
  // ==============================>
  setAccessToken                :  (token: string | null, expired?: number) => Cookies.set(auth.ACCESS_TOKEN_NAME, token ? encryption.set(token) : "", { expires: expired || auth.ACCESS_TOKEN_EXPIRED, secure: true }),

  // ==============================>
  // ## get access token from cookie
  // ==============================>
  getAccessToken                :  () => encryption.get(Cookies.get(auth.ACCESS_TOKEN_NAME) || ""),

  // ==============================>
  // ## delete access token from cookie
  // ==============================>
  deleteAccessToken             :  () => Cookies.remove(auth.ACCESS_TOKEN_NAME),

  // ==============================>
  // ## Check auth
  // ==============================>
  check                         :  () => (!Cookies.get(auth.ACCESS_TOKEN_NAME)) && redirect(auth.PATH_LOGIN),
}

