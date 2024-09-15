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
import { useUser } from "@/context/UserContext";
import { useState } from "react";

const Nav = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const { user, userDataIsLoading, logOut } = useUser();

  function toggleSheet() {
    setSheetOpen((prevState) => !prevState);
  }

  function logoutHandler() {
    logOut();
    toggleSheet();
  }

  return (
    <nav className="flex gap-3 items-center">
      <div className="hidden md:flex gap-3 items-center">
        {!user && !userDataIsLoading ? (
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
        ) : (
          <Link
            href={"/account"}
            className={buttonVariants({ variant: "outline" })}
          >
            Profile
          </Link>
        )}
        <Link
          href={"/hire-remotely"}
          className={buttonVariants({ variant: "default" })}
        >
          Post a job
        </Link>
      </div>
      <Sheet open={sheetOpen} onOpenChange={toggleSheet}>
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
              {!user && (
                <>
                  <li>
                    <Link
                      onClick={toggleSheet}
                      href={"/login"}
                      className={`${buttonVariants({
                        variant: "outline",
                        size: "lg",
                      })} w-full`}
                    >
                      Sign in to your profile
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <Link
                      href="/account"
                      onClick={toggleSheet}
                      className={`${buttonVariants({
                        variant: "outline",
                        size: "lg",
                      })} w-full`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Button
                      variant={"destructive"}
                      className="w-full "
                      size={"lg"}
                      onClick={logoutHandler}
                    >
                      Logout
                    </Button>
                  </li>
                </>
              )}
            </ul>
            <div className="flex items-center justify-between">
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
