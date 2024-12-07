"use client";

import SidebarMenu from "@/components/app/account/SidebarMenu";
import TabSelector from "@/components/app/account/TabSelector";
import withAuth from "@/components/AuthGuard";
import { WithAuthProps } from "@/types/types";
import { useAccountTabs } from "./useAccountTabs";

type AccountLayoutProps = { children: React.ReactNode } & WithAuthProps;

function AccountLayout({
  user,
  fetchUserData,
  logOut,
  children,
}: AccountLayoutProps) {
  const { changeTab, currentTab, tabs } = useAccountTabs();

  return (
    <div className="w-full max-w-screen-2xl mx-auto grid px-4 py-6 md:p-8 grid-cols-1 md:grid-cols-sideNav_1 md:gap-x-8 gap-y-0 grid-rows-[auto,auto,1fr] md:grid-rows-[auto,1fr]">
      <TabSelector tabs={tabs} currentTab={currentTab} changeTab={changeTab} />
      <SidebarMenu
        tabs={tabs}
        currentTab={currentTab}
        changeTab={changeTab}
        logOut={logOut}
      />
      {children}
    </div>
  );
}

export default withAuth(AccountLayout);
