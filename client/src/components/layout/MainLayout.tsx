"use client";

import { Toaster } from "../ui/toaster";
import Header from "./Header";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { UserContextProvider } from "@/context/UserContext";
import ThemeProvider from "@/context/ThemeProvider";
import { AuthContextProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <UserContextProvider>
            <CurrencyProvider>
              <Header />
              <main className="h-[calc(100vh-67px)]">{children}</main>
              <Toaster />
            </CurrencyProvider>
          </UserContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
