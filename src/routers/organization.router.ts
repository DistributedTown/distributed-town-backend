import { injectable } from "inversify";
import { Router } from "express";
import { OrganizationController } from "../controllers";

@injectable()
export class OrganizationRouter {
  private readonly _router: Router;

  constructor(private organizationController: OrganizationController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.get("/", this.organizationController.get);
  }

  public get router(): Router {
    return this._router;
  }
}
