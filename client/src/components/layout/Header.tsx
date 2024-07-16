import { Switch } from "../ui/switch";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className="px-5 py-4 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-semibold">Jobremote.com</h1>
        <div className="pt-1 flex items-center gap-3">
          <small className="text-zinc-400">Best job board</small>
          <Switch />
        </div>
      </div>
      <Nav />
    </header>
  );
};

export default Header;
