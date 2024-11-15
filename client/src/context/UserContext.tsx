"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import { handleError } from "@/lib/errorHandler";
import { useToast } from "@/components/ui/use-toast";

interface UserContextTypes {
  user: UserType | null;
  logOut: () => void;
  fetchUserData: () => Promise<void>;
  userDataIsLoading: boolean;
}

interface UserContextProviderTypes {
  children: React.ReactNode;
}

function useLogout(handleUserDataChange: (state: null) => void) {
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/users/logout");
      return response.data;
    },
    onSuccess: () => {
      handleUserDataChange(null);
      router.push("/");
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });
}

function useGetUser() {
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/me");
      return response.data;
    },
    enabled: false,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

function useCheckSession() {
  return useQuery({
    queryKey: ["userSession"],
    queryFn: async () => {
      return await axiosInstance.get("/users/check-session");
    },
    retry: false,
  });
}
const UserContext = createContext<UserContextTypes | undefined>(undefined);

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [user, setUser] = useState<UserType | null>(null);
  const [userDataIsLoading, setUserDataIsLoading] = useState(true);

  const handleUserDataChange = (state: UserType | null) => {
    setUser(state);
  };

  const { mutate: logout } = useLogout(handleUserDataChange);

  const { data: sessionState, isPending: sessionLoading } = useCheckSession();

  const { data: userData, refetch, isError } = useGetUser();

  useEffect(() => {
    if (!sessionLoading) {
      if (sessionState?.data.state === true) {
        refetch();
      } else {
        setUser(null);
        setUserDataIsLoading(false);
      }
    }
  }, [sessionLoading, sessionState, refetch]);

  useEffect(() => {
    if (userData) {
      setUser(userData.user);
      setUserDataIsLoading(false);
    } else if (isError) {
      setUser(null);
      setUserDataIsLoading(false);
    }
  }, [userData, isError]);

  const fetchUserData = async () => {
    await refetch();
  };

  const logOut = () => {
    logout();
  };

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
