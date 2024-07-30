import { jobPositionsContract } from "../contracts/jobPositions.contract";
import JobPositionModel from "../models/filters/JobPosition.model";
import { tsServer } from "../utils/utils";

export const jobPositionsRouter = tsServer.router(jobPositionsContract, {
  getJobPositions: async () => {
    try {
      const jobPositions = await JobPositionModel.find({});

      return {
        status: 200,
        body: {
          msg: "Successfuly retrieved data",
          jobPositions: jobPositions,
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to fetch available job positions.",
        },
      };
    }
  },
  createJobPosition: async ({ body }) => {
    const { title } = body;
    try {
      const jobPosition = await JobPositionModel.create({ title });
      return {
        status: 201,
        body: {
          msg: "Successfuly create a new job position",
          jobPosition,
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to create a new job position.",
        },
      };
    }
  },
});
