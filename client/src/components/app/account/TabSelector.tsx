import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../../ui/select";

type TabSelectorPropsType = {
  tabs: { code: string; name: string }[];
  currentTab: string;
  changeTab: (value: string) => void;
};

export default function TabSelector({
  tabs,
  currentTab,
  changeTab,
}: TabSelectorPropsType) {
  return (
    <Select onValueChange={changeTab}>
      <SelectTrigger className="md:hidden mb-6 sticky top-[91px] z-30">
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
  );
}
