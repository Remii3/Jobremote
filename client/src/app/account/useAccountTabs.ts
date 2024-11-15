import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const tabs: { code: string; name: string }[] = [
  { name: "Details", code: "details" },
  { name: "Settings", code: "settings" },
  { name: "Your Offers", code: "your-offers" },
];

export function useAccountTabs() {
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

  return {
    currentTab,
    changeTab,
    tabs,
  };
}
