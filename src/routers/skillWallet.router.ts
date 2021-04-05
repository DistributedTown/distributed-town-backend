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
    this._router.get('/:skillWalletIds', this.skillWalletController.get);
    // this._router.put('/', this.skillWalletController.put);
    // this._router.get('/messages', this.skillWalletController.getMessages);
    // this._router.get('/invite', this.skillWalletController.invite);
  }

  public get router(): Router {
    return this._router;
  }
}
