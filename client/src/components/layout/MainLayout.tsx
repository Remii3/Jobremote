"use client";
import { Toaster } from "../ui/toaster";
import Header from "./Header";
import {
  QueryClientProvider,
  QueryClient,
} from "@ts-rest/react-query/tanstack";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { UserContextProvider } from "@/context/UserContext";
import ThemeProvider from "@/context/ThemeProvider";

const queryClient = new QueryClient();

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <CurrencyProvider>
            <Header />
            <main className="h-[calc(100vh-67px)]">{children}</main>
            <Toaster />
          </CurrencyProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
