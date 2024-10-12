"use client";
import Details from "@/components/account/Details";
import Settings from "@/components/account/Settings";
import YourOffers from "@/components/account/YourOffers";
import withAuth from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { WithAuthProps } from "@/types/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tabs: { code: string; name: string }[] = [
  { name: "Details", code: "details" },
  { name: "Settings", code: "settings" },
  { name: "Your Offers", code: "your-offers" },
];
type AccountPageProps = WithAuthProps;

function AccountPage({ user, fetchUserData, logOut }: AccountPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") || "details";
  const [currentTab, setCurrentTab] = useState(initialTab);

  useEffect(() => {
    const tabFromParams = searchParams.get("tab");
    if (tabFromParams && tabFromParams !== currentTab) {
      setCurrentTab(tabFromParams);
    }
  }, [searchParams, currentTab]);

  function changeTab(tab: string) {
    if (tab === currentTab) return;

    setCurrentTab(tab);
    const tabFromParams = new URLSearchParams(searchParams);
    tabFromParams.set("tab", tab);
    router.replace(`/account?${tabFromParams.toString()}`);
  }

  useEffect(() => {
    if (!searchParams.get("tab")) {
      const tabFromParams = new URLSearchParams(searchParams);
      tabFromParams.set("tab", currentTab);
      router.replace(`/account?${tabFromParams.toString()}`);
    }
  }, [searchParams, router, currentTab]);

  return (
    <div
      className="h-full w-full max-w-screen-2xl mx-auto content-start grid px-4 py-6 md:p-8 grid-cols-1 md:grid-cols-sideNav_1 md:gap-8 md:grid-rows-2"
      style={{
        gridTemplateRows: "auto 1fr",
        rowGap: 0,
      }}
    >
      <Select onValueChange={(e: string) => changeTab(e)}>
        <SelectTrigger className="md:hidden mb-6">
          {tabs.find((tab) => tab.code === currentTab)?.name}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {tabs.map((tab) => (
              <SelectItem
                key={tab.code}
                value={tab.code}
                disabled={currentTab === tab.code}
              >
                {tab.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
          onClick={() => logOut()}
        >
          Logout
        </Button>
      </div>

      {currentTab === "details" && (
        <Details user={user} fetchUserData={fetchUserData} />
      )}
      {currentTab === "settings" && (
        <Settings user={user} fetchUserData={fetchUserData} />
      )}
      {currentTab === "your-offers" && (
        <YourOffers user={user} fetchUserData={fetchUserData} />
      )}
    </div>
  );
}

export default withAuth(AccountPage);
