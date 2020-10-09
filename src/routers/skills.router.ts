import { injectable } from "inversify";
import { Router } from "express";
import { SkillsController } from "../controllers";

@injectable()
export class SkillsRouter {
  private readonly _router: Router;

  constructor(private skillsController: SkillsController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.get("/", this.skillsController.get);
  }

  public get router(): Router {
    return this._router;
  }
}
