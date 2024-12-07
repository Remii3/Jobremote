import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

const tabs: { code: string; name: string }[] = [
  { name: "Details", code: "details" },
  { name: "Settings", code: "settings" },
  { name: "Your Offers", code: "your-offers" },
];

export function useAccountTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = useMemo(() => pathname.split("/")[2], [pathname]);

  function changeTab(tab: string) {
    if (tab === currentTab) return;
    router.replace(`/account/${tab}`);
  }

  return {
    currentTab,
    changeTab,
    tabs,
  };
}
