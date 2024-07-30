import { z } from "zod";
import { c } from "../utils/utils";
import { JobPositionSchema } from "../schemas/offerSchemas";

export const jobPositionsContract = c.router({
  getJobPositions: {
    method: "GET",
    path: "/job-positions",
    responses: {
      200: z.object({
        msg: z.string(),
        jobPositions: z.array(JobPositionSchema),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    summary: "Get job positions",
  },
  createJobPosition: {
    method: "POST",
    path: "/job-position",
    responses: {
      201: z.object({
        msg: z.string(),
        jobPosition: JobPositionSchema,
      }),
    },
    body: z.object({
      title: z.string(),
    }),
    summary: "Create new job position",
  },
});
