import { Response, Request, NextFunction } from "express";
import { UpdateOffer } from "../../types/controllers";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const UpdateOfferSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
    experience: z.string().min(1, { message: "Experience is required" }),
    localization: z.string().min(1, { message: "Localization is required" }),
    contractType: z.string().min(1, { message: "Contract type is required" }),
    employmentType: z
      .string()
      .min(1, { message: "Employment type is required" }),
    maxSalary: z
      .number()
      .gt(0, { message: "Max salary must be greater than 0" }),
    minSalary: z
      .number()
      .gt(0, { message: "Min salary must be greater than 0" }),
    technologies: z.array(z.string()),
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
    redirectLink: z.string(),
    priceType: z.enum(["monthly", "yearly"]),
  })
  .partial();

export function validateUpdateOffer(
  req: Request<{}, {}, UpdateOffer>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = UpdateOfferSchema.parse(req.body);

    next();
  } catch (err) {
    next(err);
  }
}

export function sanitizeUpdateOffer(
  req: Request<{}, {}, UpdateOffer>,
  res: Response,
  next: NextFunction
) {
  const sanitizedBody: Partial<UpdateOffer> = {};

  if (req.body.title) {
    sanitizedBody.title = sanitizeHtml(req.body.title, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.companyName) {
    sanitizedBody.companyName = sanitizeHtml(req.body.companyName, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.contractType) {
    sanitizedBody.contractType = sanitizeHtml(req.body.contractType, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.currency) {
    sanitizedBody.currency = sanitizeHtml(req.body.currency, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.employmentType) {
    sanitizedBody.employmentType = sanitizeHtml(req.body.employmentType, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.experience) {
    sanitizedBody.experience = sanitizeHtml(req.body.experience, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.localization) {
    sanitizedBody.localization = sanitizeHtml(req.body.localization, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.technologies) {
    sanitizedBody.technologies = req.body.technologies.map((technology) =>
      sanitizeHtml(technology, {
        allowedTags: [],
        allowedAttributes: {},
      })
    );
  }

  if (req.body.logo) {
    sanitizedBody.logo = {
      key: sanitizeHtml(req.body.logo.key, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      url: sanitizeHtml(req.body.logo.url, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      name: sanitizeHtml(req.body.logo.name, {
        allowedTags: [],
        allowedAttributes: {},
      }),
    };
  }

  if (req.body.maxSalary !== undefined) {
    sanitizedBody.maxSalary = Number(req.body.maxSalary);
  }

  if (req.body.minSalary !== undefined) {
    sanitizedBody.minSalary = Number(req.body.minSalary);
  }

  if (req.body.priceType) {
    sanitizedBody.priceType = sanitizeHtml(req.body.priceType, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.pricing) {
    sanitizedBody.pricing = sanitizeHtml(req.body.pricing, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (req.body.redirectLink) {
    sanitizedBody.redirectLink = sanitizeHtml(req.body.redirectLink, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
  if (req.body.content) {
    sanitizedBody.content = sanitizeHtml(req.body.content, {
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
    });
  }

  req.body = sanitizedBody;

  next();
}
