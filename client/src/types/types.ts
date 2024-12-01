export type AllowedCurrenciesType = "USD" | "EUR";

export type AllowedSalaryTypes = "yearly" | "monthly";

export type OfferType = {
  _id: string;
  title: string;
  content: string;
  requirements: string;
  benefits: string;
  duties: string;
  experience: string;
  localization: string;
  contractType: string;
  employmentType: string;
  maxSalary: number;
  minSalary: number;
  minSalaryYear: number;
  maxSalaryYear: number;
  currency: AllowedCurrenciesType;
  technologies: string[];
  logo: { key: string; url: string; name: string } | null;
  companyName: string;
  createdAt: string;
  updatedAt: string;
  redirectLink: string;
};

export type AdminOfferType = OfferType & {
  pricing: string;
  isPaid: boolean;
  activeUntil: string | null;
};

export type OfferFiltersType = {
  keyword: string[];
  localization: string[];
  experience: string[];
  contractType: string[];
  employmentType: string[];
  technologies: string[];
  minSalary: number;
};

export type OfferFilterType = {
  _id: string;
  name: string;
};

// Filters

export type OfferSortOptionsTypes =
  | "latest"
  | "salary_highest"
  | "salary_lowest";

export type UserType = {
  _id: string;
  email: string;
  commercialConsent: boolean;
  createdAt: string;
  updatedAt: string;
  appliedToOffers: string[];
  name: string;
  description: string;
};

export type WithAuthProps = {
  user: UserType;
  fetchUserData: () => Promise<void>;
  logOut: () => void;
};
