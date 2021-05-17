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
    this._router.post("/login", this.skillWalletController.login);
    this._router.get("/login", this.skillWalletController.getLogins);
    this._router.get("/:skillWalletId/nonces", this.skillWalletController.getNonceForValidation);
    this._router.delete("/:skillWalletId/nonces", this.skillWalletController.deleteNonce);
    this._router.post('/:skillWalletId/nonces', this.skillWalletController.generateNonce);
    this._router.post("/:skillWalletId/activate", this.skillWalletController.activateSkillWallet);
    this._router.get("/:skillWalletId/isActive", this.skillWalletController.isActive);
    this._router.get("/:skillWalletId/messages", this.skillWalletController.getMessages);
    this._router.post("/:skillWalletId/validate", this.skillWalletController.validateSW);
    this._router.get("/keys", this.skillWalletController.getKeys);


  }

  public get router(): Router {
    return this._router;
  }
}
