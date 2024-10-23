"use client";

import SidebarMenu from "@/components/account/SidebarMenu";
import TabContent from "@/components/account/TabContent";
import TabSelector from "@/components/account/TabSelector";
import withAuth from "@/components/AuthGuard";
import { useAccountTabs } from "@/hooks/account/useAccountTabs";

import { WithAuthProps } from "@/types/types";

type AccountPageProps = WithAuthProps;

function AccountPage({ user, fetchUserData, logOut }: AccountPageProps) {
  const { changeTab, currentTab, tabs } = useAccountTabs();

  return (
    <div className="h-full w-full max-w-screen-2xl mx-auto content-start grid px-4 py-6 md:p-8 grid-cols-1 md:grid-cols-sideNav_1 md:gap-x-8 gap-y-0 grid-rows-[auto,auto,1fr] md:grid-rows-[auto,1fr]">
      <TabSelector tabs={tabs} currentTab={currentTab} changeTab={changeTab} />
      <SidebarMenu
        tabs={tabs}
        currentTab={currentTab}
        changeTab={changeTab}
        logOut={logOut}
      />
      <TabContent
        currentTab={currentTab}
        user={user}
        fetchUserData={fetchUserData}
      />
    </div>
  );
}

export default withAuth(AccountPage);
