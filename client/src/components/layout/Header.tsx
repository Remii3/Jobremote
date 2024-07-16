"use client";

import { useLayoutEffect, useState } from "react";
import { Switch } from "../ui/switch";
import Nav from "./Nav";

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
    <header className="px-5 py-4 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-semibold">Jobremote.com</h1>
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
