"use client";

import Nav from "./Nav";
import Link from "next/link";

import CurrencySelector from "../ui/currency-selector";
import ThemeSelector from "../ui/theme-selector";
import { useUser } from "@/context/UserContext";

const Header = () => {
  return (
    <header className="px-2 py-3 flex justify-between items-center shadow-sm sticky top-0 bg-background">
      <div className="flex gap-3 items-center">
        <Link href={"/"}>
          <h1 className="text-2xl font-semibold">Jobremote.com</h1>
        </Link>
        <div className="pt-1 md:flex items-center gap-3 hidden">
          <small className="text-zinc-400">Best job board</small>
          <ThemeSelector />
        </div>
        <div className="hidden md:block">
          <CurrencySelector />
        </div>
      </div>
      <Nav />
    </header>
  );
};

export default Header;
