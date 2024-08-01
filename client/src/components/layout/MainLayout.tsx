"use client";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import Header from "./Header";
import {
  QueryClientProvider,
  QueryClient,
} from "@ts-rest/react-query/tanstack";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { UserContextProvider } from "@/context/UserContext";

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
      <UserContextProvider>
        <CurrencyProvider>
          <Header />
          <main className="h-[calc(100vh-66px)]">{children}</main>
          <Toaster />
        </CurrencyProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
};

export default MainLayout;
