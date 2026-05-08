/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiSuccessResponse } from "@/types/api.types";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";
import { cookies, headers } from "next/headers";
import { getNewTokensWithRefreshToken } from "../../services/authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  if (!(await isTokenExpiringSoon(accessToken))) {
    return;
  }

  const requestHeader = await headers();

  if (requestHeader.get("x-token-refreshed") === "1") {
    return;
  }

  try {
    await getNewTokensWithRefreshToken(refreshToken);
  } catch (error: any) {
    console.error("Error refreshing token in http client:", error);
  }
}

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");


  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader
    },
  });
  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  data?: any;
}

const htttGet = async <TData>(
  endPoints: string,
  options?: ApiRequestOptions,
): Promise<ApiSuccessResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiSuccessResponse<TData>>(endPoints, {
      params: options?.params,
      headers: options?.headers,
    });

    return response.data;
  } catch (error) {
    // console.log(`Get request to ${endPoints} failed: `, error);
    throw error;
  }
};

const httpPost = async <TData>(
  endPoints: string,
  data: any,
  options?: ApiRequestOptions,
): Promise<ApiSuccessResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiSuccessResponse<TData>>(
      endPoints,
      data,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );
    return response.data;
  } catch (error) {
    // console.log(`Post request to ${endPoints} failed: `, error);
    throw error;
  }
};

const httpPut = async <TData>(
  endPoints: string,
  data?: any,
  options?: ApiRequestOptions,
): Promise<ApiSuccessResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiSuccessResponse<TData>>(
      endPoints,
      data,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );
    return response.data;
  } catch (error) {
    // console.log(`Put request to ${endPoints} failed: `, error);
    throw error;
  }
};

const httpPatch = async <TData>(
  endPoints: string,
  data: any,
  options?: ApiRequestOptions,
): Promise<ApiSuccessResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiSuccessResponse<TData>>(
      endPoints,
      data,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );
    return response.data;
  } catch (error) {
    // console.log(`Patch request to ${endPoints} failed: `, error);
    throw error;
  }
};

const httpDelete = async <TData>(
  endPoints: string,
  options?: ApiRequestOptions,
): Promise<ApiSuccessResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiSuccessResponse<TData>>(
      endPoints,
      {
        params: options?.params,
        headers: options?.headers,
        data: options?.data,
      },
    );
    return response.data;
  } catch (error) {
    // console.log(`Delete request to ${endPoints} failed: `, error);
    throw error;
  }
};

export const httpClient = {
  get: htttGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
