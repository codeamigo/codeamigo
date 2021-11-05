import { MiddlewareFn } from "type-graphql";

import { CodeModule } from "../entities/CodeModule";
import { Session } from "../entities/Session";
import { Step } from "../entities/Step";
import { MyContext } from "../types";

export const isSessionOwner: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  if (!context.req.session.userId) {
    throw new Error("User is not authenticated.");
  }

  try {
    if (context.req.body.operationName === "UpdateCodeModule") {
      const codeModuleId = context.req.body.variables.id;
      const codeModule = await CodeModule.findOne(codeModuleId, {
        relations: ["step"],
      });
      console.log("step id", codeModule?.step.id);
      const step = await Step.findOne(codeModule?.step.id, {
        relations: ["session"],
      });
      console.log(step);
      const session = await Session.findOne(step?.session.id, {
        relations: ["user"],
      });
      console.log(session);
    }
  } catch (e) {
    console.log(e);
  }

  return next();
};
