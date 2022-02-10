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
    this._router.get("/key/:key", this.communityController.getCommunityByPartnerAgreementKey);
    this._router.get("/:communityAddress/key", this.communityController.getPAByCommunity);
    this._router.get("/calculateCredits", this.communityController.calculateCredits)
    this._router.post("/key", this.communityController.postPartnerAgreement)
    this._router.get('/:communityAddress/gigs', this.communityController.getGigs);

  }

  public get router(): Router {
    return this._router;
  }
}
