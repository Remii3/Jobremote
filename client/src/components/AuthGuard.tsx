"use client";
import { useUser } from "@/context/UserContext";
import { WithAuthProps } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function withAuth<T extends WithAuthProps>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: Omit<T, keyof WithAuthProps>) {
    const { user, userDataIsLoading, fetchUserData, logOut } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!userDataIsLoading && !user) {
        router.replace("/login");
      }
    }, [user, router, userDataIsLoading]);

    if (userDataIsLoading || !user) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
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
