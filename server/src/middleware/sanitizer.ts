import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

export function sanitizeOfferContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body && req.body.content) {
    req.body.content = sanitizeHtml(req.body.content, {
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
  next();
}
