import { UserTypes } from "@/types/types";
import { createContext, useContext, useState } from "react";

interface UserContextTypes {
  user: UserTypes | null;
  logIn: (user: UserTypes) => void;
  logOut: () => void;
}

interface UserContextProviderTypes {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextTypes | undefined>(undefined);

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [user, setUser] = useState<UserTypes | null>(null);

  function logIn(user: UserTypes) {
    setUser(user);
  }

  function logOut() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ logIn, logOut, user }}>
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
