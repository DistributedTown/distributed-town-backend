import { injectable } from "inversify";
import { Router } from "express";
import { CommunityController } from "../controllers";

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
    this._router.get('/:communityAddress/gigs', this.communityController.getGigs);

  }

  public get router(): Router {
    return this._router;
  }
}
