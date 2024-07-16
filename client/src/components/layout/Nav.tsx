import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Nav = () => {
  return (
    <nav className="flex gap-3 items-center">
      <Button variant={"outline"}>Login</Button>
      <Button variant={"default"} className="">
        Post a job
      </Button>
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
