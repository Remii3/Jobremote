"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, userDataIsLoading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!userDataIsLoading && !user) {
      router.replace("/login");
    }
  }, [user, router, userDataIsLoading]);
  if (!user) return null;
  return children;
}
