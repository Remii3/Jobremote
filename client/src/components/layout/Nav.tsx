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

const Nav = () => {
  return (
    <nav className="flex gap-3 items-center">
      <Button variant={"outline"}>Login</Button>
      <Link
        href={"/hire-remotely"}
        className={buttonVariants({ variant: "default" })}
      >
        Post a job
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"} className="px-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Placeholder descrioption</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Nav;
