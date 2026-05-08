"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";



const getTokenSecondsRemaining = (token: string): number => {
  if (!token) return 0;

  try {
    const tokenPaylod = jwt.decode(token) as JwtPayload;

    if (tokenPaylod && !tokenPaylod.exp) {
      return 0;
    }

    const remainingSecond =
      (tokenPaylod.exp as number) - Math.floor(Date.now() / 1000);
    return remainingSecond > 0 ? remainingSecond : 0;
  } catch (err) {
    console.log("Error decoding token", err);
    return 0;
  }
};





export const setTokenInCookies = async (
  name: string,
  token: string,
  fallBackMaxAgeInSecond = 60 * 60 * 24,
) => {
    let maxAgeInSeconds;

    if (name !== "better-auth.session_token"){
        maxAgeInSeconds = getTokenSecondsRemaining(token);
    }


  await setCookie(
    name,
    token,
    maxAgeInSeconds ? maxAgeInSeconds : fallBackMaxAgeInSecond,
  );
};


export async function isTokenExpiringSoon(token: string, thresholdInSeconds = 300) : Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

export async function isTokenExpired(token: string) : Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds === 0;
}
