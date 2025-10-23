import Router from 'next/router';
import Cookies from 'js-cookie';
import { encryption } from '@helpers/.';

export const middleware = {
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
  setAccessToken                :  (token: string | null, expired?: number) => Cookies.set(middleware.ACCESS_TOKEN_NAME, token ? encryption.set(token) : "", { expires: expired || middleware.ACCESS_TOKEN_EXPIRED, secure: true }),
  
  // ==============================>
  // ## get access token from cookie
  // ==============================>
  getAccessToken                :  () => encryption.get(Cookies.get(middleware.ACCESS_TOKEN_NAME) || ""),

  // ==============================>
  // ## delete access token from cookie
  // ==============================>
  deleteAccessToken             :  () => Cookies.remove(middleware.ACCESS_TOKEN_NAME),

  // ==============================>
  // ## Check auth
  // ==============================>
  check                         :   () => (!Cookies.get(middleware.ACCESS_TOKEN_NAME)) && Router.push(middleware.PATH_LOGIN),
}

