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
    this._router.post("/",  passport.authenticate("magic"),this.communityController.post);
    this._router.get("/:communityID", passport.authenticate("magic"), this.communityController.getByID);
  }

  public get router(): Router {
    return this._router;
  }
}
