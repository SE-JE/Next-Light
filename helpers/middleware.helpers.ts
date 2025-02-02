import Router from "next/router";
import Cookies from "js-cookie";

export const loginPath = "/login";
export const basePath = "/";

export const token_cookie_name =
  String(process.env.NEXT_PUBLIC_APP_NAME || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") + ".user.token";

export const unauthenticated = () => {
  if (!Cookies.get(token_cookie_name)) {
    Router.push(loginPath);
  }
};
