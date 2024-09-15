"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "./switch";
import { Moon, Sun } from "lucide-react";

export default function ThemeSelector() {
  const { setTheme, theme, systemTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!hasMounted) return null;

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <Switch
      onCheckedChange={handleThemeChange}
      checked={currentTheme === "dark"}
    >
      <Moon
        className={`h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  absolute transition-[opacity] ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      />
      <Sun
        className={`h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute transition-[opacity] ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        }`}
      />
    </Switch>
  );
}
