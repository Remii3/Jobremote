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
import fetchWithAuth from "@/lib/fetchWithAuth";

interface UserContextTypes {
  user: UserType | null;
  logOut: () => void;
  fetchUserData: () => Promise<void>;
  userDataIsLoading: boolean;
}

interface ServerUserResponse {
  user: UserType;
}

interface UserContextProviderTypes {
  children: React.ReactNode;
}
const UserContext = createContext<UserContextTypes | undefined>(undefined);

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [user, setUser] = useState<UserType | null>(null);
  const [userDataIsLoading, setUserDataIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = useCallback(async () => {
    try {
      setUserDataIsLoading(true);
      const response = await fetchWithAuth<ServerUserResponse>("/users/me");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      handleError(error, toast);
    } finally {
      setUserDataIsLoading(false);
    }
  }, [toast]);

  async function logOut() {
    try {
      await axiosInstance.post("/users/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (error) {
      handleError(error, toast);
    }
  }

  useEffect(() => {
    async function initializeAuth() {
      if (!localStorage.getItem("accessToken")) {
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
  }, [fetchUserData, toast]);

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
