"use client";
// import { client } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";

interface UserContextTypes {
  user: UserType | null;
  logOut: () => void;
  fetchUserData: () => Promise<void>;
  userDataIsLoading: boolean;
}

interface UserContextProviderTypes {
  children: React.ReactNode;
}
const logoutUser = async () => {
  const response = await axiosInstance.post('/users/logout');
  return response.data;  // Return only the data from the response
};
function useLogout(setUser) {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setUser(null);       // Clear user data
      router.push("/");     // Redirect to home page
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });
}
const getUser = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
}
function useGetUser() {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getUser,
    enabled: false,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
async function checkSession  () {
  return await axiosInstance.get("/users/check-session");
}
function useCheckSession() {
  return useQuery({
    queryKey: ["userSession"],
    queryFn: checkSession,
    retry: false,
  });
}
const UserContext = createContext<UserContextTypes | undefined>(undefined);

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [user, setUser] = useState<UserType | null>(null);
  const [userDataIsLoading, setUserDataIsLoading] = useState(true);
  const router = useRouter();

  const { mutate: logout } = useLogout(setUser);

  const { data: sessionState, isPending: sessionLoading } =
  useCheckSession();

  const {
    data: userData,
    refetch,
    isError,
  } = useGetUser();

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
      setUser(userData.body.user);
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
