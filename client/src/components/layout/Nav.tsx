import { Menu } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import CurrencySelector from "../ui/currency-selector";
import ThemeSelector from "../ui/theme-selector";

const Nav = () => {
  return (
    <nav className="flex gap-3 items-center">
      <div className="hidden md:flex gap-3 items-center">
        <Link
          href={"/login"}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
        <Link
          href={"/hire-remotely"}
          className={buttonVariants({ variant: "default" })}
        >
          Post a job
        </Link>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"} className="px-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className="sr-only">Sheet menu</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100%-28px)] pt-7">
            <ul className="flex-grow space-y-3">
              <li>
                <Link
                  href={"/login"}
                  className={`${buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })} w-full`}
                >
                  Sign in to Candidate profile
                </Link>
              </li>
              <li>
                <Link
                  href={"/login"}
                  className={`${buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })} w-full`}
                >
                  Sign in to Employer&apos;s panel
                </Link>
              </li>
            </ul>
            <div className="md:hidden flex items-center justify-between">
              <CurrencySelector />
              <ThemeSelector />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Nav;
