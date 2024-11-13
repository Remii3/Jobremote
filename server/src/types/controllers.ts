// User types

export type CreateUser = {
  email: string;
  password: string;
  passwordRepeat: string;
  commercialConsent: boolean;
  privacyPolicyConsent: boolean;
};

// Offer types
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
    keyword: string;
    minSalary: string;
    contractType: string;
  };
};
