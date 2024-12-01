import { useUser } from "@/context/UserContext";
import { WithAuthProps } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { StaticBodyCenter } from "./layout/StaticBody";

export default function withAuth<T extends WithAuthProps>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: Omit<T, keyof WithAuthProps>) {
    const { user, userDataIsLoading, fetchUserData, logOut } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!user && !userDataIsLoading) {
        router.replace("/login");
      }
    }, [user, router, userDataIsLoading]);

    if (userDataIsLoading || !user) {
      return (
        <StaticBodyCenter>
          <Loader2 className="h-8 w-8 animate-spin" />
        </StaticBodyCenter>
      );
    }
    return (
      <Component
        {...(props as T)}
        user={user}
        fetchUserData={fetchUserData}
        logOut={logOut}
      />
    );
  };
}
