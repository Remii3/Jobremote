// User types

export type CreateUser = {
  email: string;
  password: string;
  passwordRepeat: string;
  commercialConsent: boolean;
  privacyPolicyConsent: boolean;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type PasswordChange = {
  password: string;
  resetToken: string;
};

// Offer types

export type CreateOffer = {
  title: string;
  content: string;
  requirements?: string;
  benefits?: string;
  duties?: string;
  experience: string;
  localization: string;
  contractType: string;
  employmentType: string;
  maxSalary: number;
  minSalary: number;
  minSalaryYear: number;
  maxSalaryYear: number;
  technologies: string;
  currency: string;
  userId: string;
  logo: {
    key: string;
    url: string;
    name: string;
  } | null;
  companyName: string;
  pricing: string;
  redirectLink?: string;
};

export type UpdateOffer = {
  title?: string;
  content?: string;
  experience?: string;
  localization?: string;
  contractType?: string;
  employmentType?: string;
  maxSalary?: number;
  minSalary?: number;
  technologies?: string[];
  currency?: string;
  logo?: {
    key: string;
    url: string;
    name: string;
  } | null;
  companyName?: string;
  pricing?: string;
  redirectLink?: string;
};

export type ExtendActiveOffer = {
  offerId: string;
  title: string;
  currency: string;
};

export type PayForOffer = {
  offerId: string;
  title: string;
  currency: string;
};
export type OfferApply = {
  description: string;
  email: string;
  name: string;
  offerId: string;
  userId: string;
};
export type DeleteOffer = {
  _id: string;
};
export type GetOffers = {
  page: string;
  limit: string;
  sort: string;
  filters: {
    employmentType: string[];
    localization: string[];
    experience: string[];
    technologies: string[];
    keyword: string[];
    contractType: string[];
    minSalary: string;
    clientCurrency: string;
    salaryType: string;
  };
};
