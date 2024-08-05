"use client";
import { useLayoutEffect, useState } from "react";
import { Switch } from "./switch";

export default function ThemeSelector() {
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
  return <Switch onClick={setDarkMode} checked={theme == "dark"} />;
}
