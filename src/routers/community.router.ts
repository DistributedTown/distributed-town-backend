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
    this._router.get("/", this.communityController.get);
    this._router.post("/join", this.communityController.joinNewUser)
    this._router.get("/calculateCredits", this.communityController.calculateCredits)
    this._router.get("/:communityAddress/project", this.communityController.getProjects)
    this._router.post("/:communityAddress/project", this.communityController.createProject)
  }

  public get router(): Router {
    return this._router;
  }
}
