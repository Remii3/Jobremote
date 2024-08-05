"use client";

import { useLayoutEffect, useState } from "react";
import { Switch } from "../ui/switch";
import Nav from "./Nav";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useCurrency } from "@/context/CurrencyContext";
import { allowedCurrencies } from "../../../../server/src/schemas/offerSchemas";
import { CurrencyTypes } from "@/types/types";
import CurrencySelector from "../ui/currency-selector";
import ThemeSelector from "../ui/theme-selector";

const Header = () => {
  return (
    <header className="px-4 py-3 flex justify-between items-center shadow-sm">
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
