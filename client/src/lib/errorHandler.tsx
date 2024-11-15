import { ERROR_MESSAGES, TOAST_TITLES } from "@/constants/constant";
import { isAxiosError } from "axios";

export function handleError(error: unknown, toast: (options: any) => void) {
  console.error(error);

  if (isAxiosError(error)) {
    let errorMessage;
    switch (error.response?.status) {
      case 404:
        errorMessage = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 401:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case 403:
        errorMessage = ERROR_MESSAGES.FORBIDDEN;
        break;
      case 500:
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        errorMessage =
          error.response?.data.message || ERROR_MESSAGES.GENERIC_ERROR;
    }

    toast({
      title: TOAST_TITLES.ERROR,
      description: errorMessage,
      variant: "destructive",
    });
  } else {
    toast({
      title: TOAST_TITLES.ERROR,
      description: ERROR_MESSAGES.NETWORK_ERROR,
      variant: "destructive",
    });
  }
}
