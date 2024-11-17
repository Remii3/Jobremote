import { axiosInstance } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextTypes {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  accessTokenIsLoading: boolean;
}

export const AuthContext = createContext<AuthContextTypes>({
  accessToken: null,
  setAccessToken: () => {},
  accessTokenIsLoading: true,
});

function AuthContextProvider({ children }: any) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenIsLoading, setAccessTokenIsLoading] =
    useState<boolean>(true);
  useEffect(() => {
    const refresh = async () => {
      if (localStorage.getItem("loggedIn") !== "true") {
        setAccessTokenIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/users/refresh-token");
        setAccessToken(response.data.accessToken);
        setAccessTokenIsLoading(false);
      } catch (err) {
        setAccessTokenIsLoading(false);
      }
    };
    refresh();
  }, []);
  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, accessTokenIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}

export { AuthContextProvider, useAuth };
