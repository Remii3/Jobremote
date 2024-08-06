import { client } from "@/lib/utils";
import { PublicUserSchema } from "../../../server/src/schemas/userSchemas";
import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
type UserTypes = z.infer<typeof PublicUserSchema>;
interface UserContextTypes {
  user: UserTypes | null;
  logOut: () => void;
  fetchUserData: () => void;
  userDataIsLoading: boolean;
}

interface UserContextProviderTypes {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextTypes | undefined>(undefined);

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [userDataIsLoading, setUserDataIsLoading] = useState(true);
  const router = useRouter();

  const { mutate: logout } = client.users.logoutUser.useMutation({
    onSuccess: () => {
      setUser(null);
      router.push("/");
    },
  });

  const { data: sessionState, isLoading } =
    client.users.checkUserSession.useQuery(
      ["userSession"],
      {},
      {
        retry: false,
        refetchOnWindowFocus: false,
        onSuccess: () => {},
      }
    );

  const { data, refetch, isError } = client.users.getUser.useQuery(
    ["userData"],
    {},
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
      enabled: false,
    }
  );
  useEffect(() => {
    if (!isLoading && sessionState?.body.state === false) {
      setUserDataIsLoading(false);
    }
  }, [isLoading, sessionState?.body.state]);
  useEffect(() => {
    if (sessionState?.body.state) {
      refetch();
    }
  }, [sessionState, refetch]);

  useEffect(() => {
    if (data && data.body.user) {
      setUser(data.body.user);
      setUserDataIsLoading(false);
    } else if (isError) {
      setUser(null);
    }
  }, [data, isError]);

  const fetchUserData = () => {
    refetch();
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
