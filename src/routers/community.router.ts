import { injectable } from "inversify";
import { Router } from "express";
import { CommunityController } from "../controllers";
const passport = require("passport");

@injectable()
export class CommunityRouter {
  private readonly _router: Router;

  constructor(private communityController: CommunityController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.get("/", this.communityController.get)
    this._router.get("/:address", this.communityController.getByAddress)
    this._router.get("/calculateCredits", this.communityController.calculateCredits)
    this._router.get("/:communityAddress/project", this.communityController.getProjects)
    this._router.post("/:communityAddress/project", this.communityController.createProject)
    this._router.post("/projects/:projectId/milestone", this.communityController.createProjectMilestone)
    this._router.get("/projects/:projectId/milestone", this.communityController.getProjectMilestones)
  }

  public get router(): Router {
    return this._router;
  }
}
