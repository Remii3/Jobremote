import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { CreateOffer } from "../../types/controllers";

const newOfferSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  localization: z.string().min(1, { message: "Localization is required" }),
  contractType: z.string().min(1, { message: "Contract type is required" }),
  employmentType: z.string().min(1, { message: "Employment type is required" }),
  maxSalary: z.coerce
    .number()
    .gt(0, { message: "Max salary must be greater than 0" }),
  minSalary: z.coerce
    .number()
    .gt(0, { message: "Min salary must be greater than 0" }),
  minSalaryYear: z.coerce
    .number()
    .gt(0, { message: "Min salary year must be greater than 0" }),
  maxSalaryYear: z.coerce
    .number()
    .gt(0, { message: "Max salary year must be greater than 0" }),
  technologies: z
    .string()
    .min(1, { message: "At least one technology is required" }),
  currency: z.enum(["USD", "EUR"]),
  logo: z
    .object({
      key: z.string(),
      url: z.string().url(),
      name: z.string(),
    })
    .nullable(),
  companyName: z.string().min(1, { message: "Company name is required" }),
  pricing: z.string(),
  redirectLink: z.string().optional(),
  benefits: z.string().optional(),
  requirements: z.string().optional(),
  duties: z.string().optional(),
  userId: z.string().min(1, { message: "User ID is required" }),
});

const ckBodySanitizeBoiler = {
  allowedTags: [
    "p",
    "h2",
    "h3",
    "h4",
    "ul",
    "li",
    "ol",
    "a",
    "i",
    "u",
    "s",
    "strong",
    "blockquote",
  ],
  allowedAttributes: {
    "*": ["style", "class", "id"],
    a: ["href", "name", "target"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    a: ["http", "https", "mailto", "tel"],
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "nofollow" }),
  },
};

export function validateCreateOffer(
  req: Request<{}, {}, CreateOffer>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = newOfferSchema.parse(req.body);

    next();
  } catch (err) {
    next(err);
  }
}

export function sanitizeCreateOffer(
  req: Request<{}, {}, CreateOffer>,
  res: Response,
  next: NextFunction
) {
  const {
    companyName,
    content,
    contractType,
    currency,
    employmentType,
    experience,
    localization,
    logo,
    maxSalary,
    minSalary,
    pricing,
    redirectLink,
    technologies,
    title,
    benefits,
    duties,
    requirements,
    userId,
  } = req.body;

  const sanitizedBody = {
    ...req.body,
    title: sanitizeHtml(title, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    companyName: sanitizeHtml(companyName, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    contractType: sanitizeHtml(contractType, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    currency: sanitizeHtml(currency, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    userId: sanitizeHtml(userId, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    employmentType: sanitizeHtml(employmentType, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    experience: sanitizeHtml(experience, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    localization: sanitizeHtml(localization, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    technologies: sanitizeHtml(technologies, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    logo: logo
      ? {
          key: sanitizeHtml(logo.key, {
            allowedTags: [],
            allowedAttributes: {},
          }),
          url: sanitizeHtml(logo.url, {
            allowedTags: [],
            allowedAttributes: {},
          }),
          name: sanitizeHtml(logo.name, {
            allowedTags: [],
            allowedAttributes: {},
          }),
        }
      : null,
    maxSalary: Number(maxSalary),
    minSalary: Number(minSalary),
    minSalaryYear: Number(req.body.minSalaryYear),
    maxSalaryYear: Number(req.body.maxSalaryYear),
    pricing: sanitizeHtml(pricing, {
      allowedTags: [],
      allowedAttributes: {},
    }),

    content: sanitizeHtml(content, ckBodySanitizeBoiler),
  };

  if (benefits) {
    req.body.benefits = sanitizeHtml(benefits, ckBodySanitizeBoiler);
  }

  if (requirements) {
    req.body.requirements = sanitizeHtml(requirements, ckBodySanitizeBoiler);
  }

  if (duties) {
    req.body.duties = sanitizeHtml(duties, ckBodySanitizeBoiler);
  }

  if (redirectLink) {
    req.body.redirectLink = sanitizeHtml(redirectLink, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
  req.body = sanitizedBody;

  next();
}
