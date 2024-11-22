import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "./utils";

const refreshAccessToken = async (): Promise<string> => {
  const response = await axiosInstance.post<{ accessToken: string }>(
    "/users/refresh-token"
  );

  const newAccessToken = response.data.accessToken;
  localStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
};

const fetchWithAuth = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      ...options.headers,
      Authorization: `Bearer=${accessToken}`,
    };

    return await axiosInstance<T>(url, { ...options, headers });
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (localStorage.getItem("accessToken")) {
        localStorage.removeItem("accessToken");
      }
      const newAccessToken = await refreshAccessToken();

      return axiosInstance<T>(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer=${newAccessToken}`,
        },
      });
    }

    throw error;
  }
};

export default fetchWithAuth;
