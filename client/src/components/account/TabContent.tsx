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
  {
    currentTab === "details" && (
      <Details user={user} fetchUserData={fetchUserData} />
    );
  }
  {
    currentTab === "settings" && (
      <Settings user={user} fetchUserData={fetchUserData} />
    );
  }
  {
    currentTab === "your-offers" && (
      <YourOffers user={user} fetchUserData={fetchUserData} />
    );
  }
  return null;
};

export default TabContent;
