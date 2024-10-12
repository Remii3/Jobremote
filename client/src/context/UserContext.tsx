"use client";
import { client } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/types";
import { set } from "lodash";

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
  const router = useRouter();

  const { mutate: logout } = client.users.logoutUser.useMutation({
    onSuccess: () => {
      setUser(null);
      router.push("/");
    },
  });

  const { data: sessionState, isLoading: sessionLoading } =
    client.users.checkUserSession.useQuery(
      ["userSession"],
      {},
      { queryKey: ["userSession"], retry: false }
    );

  const {
    data: userData,
    refetch,
    isError,
  } = client.users.getUser.useQuery(
    ["userData"],
    {},
    {
      queryKey: ["userData"],
      enabled: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    if (!sessionLoading) {
      if (sessionState?.body.state === true) {
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
    logout({});
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
