import { Button } from "../../ui/button";

type SidebarMenuPropsType = {
  tabs: {
    code: string;
    name: string;
  }[];
  currentTab: string;
  changeTab: (tabCode: string) => void;
  logOut: () => void;
};

export default function SidebarMenu({
  changeTab,
  currentTab,
  logOut,
  tabs,
}: SidebarMenuPropsType) {
  return (
    <div className="hidden md:flex flex-col justify-between md:col-span-1 md:row-span-2 space-y-6">
      <ul className="space-y-4">
        {tabs.map((tab) => (
          <li key={tab.code}>
            <Button
              onClick={() => changeTab(tab.code)}
              className="w-full"
              size={"lg"}
              variant={"outline"}
              disabled={currentTab === tab.code}
            >
              {tab.name}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        variant={"destructive"}
        className="w-full"
        size={"lg"}
        onClick={logOut}
      >
        Logout
      </Button>
    </div>
  );
}
