import { injectable } from "inversify";
import { Router } from "express";
import { UsersController } from "../controllers";
@injectable()
export class UserRouter {
  private readonly _router: Router;

  constructor(private userController: UsersController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.get('/', this.userController.get);
    this._router.post('/', this.userController.post);
    this._router.put('/', this.userController.put);
    this._router.get('/messages', this.userController.getMessages);
    this._router.get('/invite', this.userController.invite);
  }

  public get router(): Router {
    return this._router;
  }
}
