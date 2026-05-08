"use server"

import { cookies } from "next/headers";

export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSecond: number,
) => {
  const cookieStor = await cookies();

  cookieStor.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: maxAgeInSecond,
    // @ts-ignore
    partitioned: true,
  });
};

export const getCookie = async(name : string) =>{
const cookieStor = await cookies()
return cookieStor.get(name)?.value
}

export const deleteCookie = async (name: string) => {
  const cookieStor = await cookies();
  cookieStor.set(name, "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
    // @ts-ignore
    partitioned: true,
  });
};
