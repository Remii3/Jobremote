"use client";
import Account from "@/components/account/Account";
import Settings from "@/components/account/Settings";
import YourOffers from "@/components/account/YourOffers";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
type TabsTypes = "account" | "settings" | "YourOffers";
const tabs: TabsTypes[] = ["account", "settings", "YourOffers"];

export default function AccountPage() {
  const { user, fetchUserData, logOut } = useUser();
  const [currentTab, setCurrentTab] = useState<TabsTypes>("account");
  function changeTab(tab: TabsTypes) {
    setCurrentTab(tab);
  }

  return (
    <AuthGuard>
      {user && (
        <div className="h-full w-full max-w-screen-2xl mx-auto content-start grid px-4 py-6 md:p-8 grid-cols-1 md:grid-cols-sideNav_1 md:gap-8 md:grid-rows-1">
          <Select onValueChange={(e: TabsTypes) => changeTab(e)}>
            <SelectTrigger className="md:hidden mb-6">
              {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tabs.map((tab) => (
                  <SelectItem
                    key={tab}
                    value={tab}
                    disabled={currentTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="hidden md:flex flex-col justify-between md:col-span-1 space-y-6">
            <ul className="space-y-4">
              {tabs.map((tab) => (
                <li key={tab}>
                  <Button
                    onClick={() => changeTab(tab)}
                    className="w-full"
                    size={"lg"}
                    variant={"outline"}
                    disabled={currentTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
          <section className="md:col-span-4">
            {currentTab === "account" && (
              <Account user={user} fetchUserData={fetchUserData} />
            )}
            {currentTab === "settings" && (
              <Settings user={user} fetchUserData={fetchUserData} />
            )}
            {currentTab === "YourOffers" && (
              <YourOffers user={user} fetchUserData={fetchUserData} />
            )}
          </section>
        </div>
      )}
    </AuthGuard>
  );
}
