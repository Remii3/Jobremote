"use client";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import Header from "./Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default MainLayout;
