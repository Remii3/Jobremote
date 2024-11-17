import Nav from "./Nav";
import Link from "next/link";

import CurrencySelector from "../ui/currency-selector";
import ThemeSelector from "../ui/theme-selector";

export default function Header() {
  return (
    <header className="px-2 py-3 flex justify-between items-center border-b border-b-input shadow-sm sticky top-0 bg-background z-10">
      <div className="flex gap-3 items-center">
        <Link href={"/"}>
          <h1 className="text-xl sm:text-2xl font-semibold">Jobremote.com</h1>
        </Link>
        <div className="pt-1 md:flex items-center gap-3 hidden">
          <small className="text-muted-foreground">Best job board</small>
          <ThemeSelector />
        </div>
        <div className="hidden md:block">
          <CurrencySelector />
        </div>
      </div>
      <Nav />
    </header>
  );
}
