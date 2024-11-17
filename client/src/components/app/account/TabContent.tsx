import { UserType } from "@/types/types";
import Details from "./subpages/details/Details";
import Settings from "./subpages/settings/Settings";
import YourOffers from "./subpages/your-offers/YourOffers";

type TabContentPropsType = {
  currentTab: string;
  user: UserType;
  fetchUserData: () => void;
};

export default function TabContent({
  currentTab,
  fetchUserData,
  user,
}: TabContentPropsType) {
  if (currentTab === "details") {
    return <Details user={user} fetchUserData={fetchUserData} />;
  }

  if (currentTab === "settings") {
    return <Settings user={user} fetchUserData={fetchUserData} />;
  }

  if (currentTab === "your-offers") {
    return <YourOffers user={user} fetchUserData={fetchUserData} />;
  }

  return null;
}
