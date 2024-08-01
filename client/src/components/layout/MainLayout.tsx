"use client";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import Header from "./Header";
import {
  QueryClientProvider,
  QueryClient,
} from "@ts-rest/react-query/tanstack";

const queryClient = new QueryClient();

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      const body = document.body;
      body.classList.add("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="h-[calc(100vh-66px)]">{children}</main>
      <Toaster />
    </QueryClientProvider>
  );
};

export default MainLayout;
