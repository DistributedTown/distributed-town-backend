import { injectable } from "inversify";
import { Router } from "express";
import { SkillWalletController } from "../controllers";
@injectable()
export class SkillWalletRouter {
  private readonly _router: Router;

  constructor(private skillWalletController: SkillWalletController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.get('/', this.skillWalletController.get);
    this._router.get("/community", this.skillWalletController.getCommunity)
    this._router.get("/hasPendingAuth", this.skillWalletController.hasPendingAuthentication)
    
  }

  public get router(): Router {
    return this._router;
  }
}
