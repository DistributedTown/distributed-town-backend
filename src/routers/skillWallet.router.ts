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
    this._router.get("/community", this.skillWalletController.getCommunity);
    this._router.get("/hasPendingAuth", this.skillWalletController.hasPendingAuthentication);
    this._router.post("/activate", this.skillWalletController.activateSkillWallet);
    this._router.get("/:skillWalletId/messages", this.skillWalletController.getMessages);
    this._router.get("/authString", this.skillWalletController.getUniqueStringForLogin);
    this._router.post("/login", this.skillWalletController.login);
    this._router.get("/login", this.skillWalletController.getLogins);

    
  }

  public get router(): Router {
    return this._router;
  }
}
