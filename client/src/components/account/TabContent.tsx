import { UserType } from "@/types/types";
import Details from "./subpages/Details";
import Settings from "./subpages/Settings";
import YourOffers from "./subpages/YourOffers";

type TabContentPropsType = {
  currentTab: string;
  user: UserType;
  fetchUserData: () => void;
};

const TabContent = ({
  currentTab,
  fetchUserData,
  user,
}: TabContentPropsType) => {
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
};

export default TabContent;
