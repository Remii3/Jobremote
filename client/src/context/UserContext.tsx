"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserType } from "@/types/types";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface UserContextTypes {
  user: UserType | null;
  logOut: () => void;
  fetchUserData: () => Promise<void>;
  userDataIsLoading: boolean;
}

interface UserContextProviderTypes {
  children: React.ReactNode;
}
const UserContext = createContext<UserContextTypes | undefined>(undefined);

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [user, setUser] = useState<UserType | null>(null);
  const [userDataIsLoading, setUserDataIsLoading] = useState(true);
  const { toast } = useToast();
  const { accessToken, setAccessToken } = useAuth();

  const fetchUserData = useCallback(async () => {
    if (!accessToken) {
      setUser(null);
      setUserDataIsLoading(false);
      return;
    }

    try {
      setUserDataIsLoading(true);
      const response = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      handleError(error, toast);
    } finally {
      setUserDataIsLoading(false);
    }
  }, [accessToken, toast]);

  async function logOut() {
    try {
      await axiosInstance.post("/users/logout");
      localStorage.removeItem("loggedIn");
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      handleError(error, toast);
    }
  }

  useEffect(() => {
    async function initializeAuth() {
      if (!accessToken) {
        setUserDataIsLoading(false);
        setUser(null);
        return;
      }

      try {
        await fetchUserData();
      } catch (error) {
        setUserDataIsLoading(false);
        setUser(null);
        handleError(error, toast);
      }
    }
    initializeAuth();
  }, [accessToken, fetchUserData, toast]);

  return (
    <UserContext.Provider
      value={{ logOut, user, fetchUserData, userDataIsLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}

export { UserContextProvider, useUser };
