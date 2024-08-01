"use client";

import { useLayoutEffect, useState } from "react";
import { Switch } from "../ui/switch";
import Nav from "./Nav";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

const Header = () => {
  const [theme, setTheme] = useState<string | null>(null);
  useLayoutEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    setTheme(storedTheme);
  }, []);

  const setDarkMode = () => {
    const body = document.body;
    body.classList.toggle("dark");

    if (theme && theme === "dark") {
      window.localStorage.setItem("theme", "");
      setTheme("");
    } else {
      window.localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <header className="px-4 py-3 flex justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link href={"/"}>
          <h1 className="text-2xl font-semibold">Jobremote.com</h1>
        </Link>
        <div className="pt-1 flex items-center gap-3">
          <small className="text-zinc-400">Best job board</small>
          <Switch onClick={setDarkMode} checked={theme == "dark"} />
        </div>
      </div>
      <Nav />
    </header>
  );
};

export default Header;
