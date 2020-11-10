import { injectable } from "inversify";
import { Router } from "express";
import { GigsController } from "../controllers";
const passport = require("passport");

@injectable()
export class GigRouter {
  private readonly _router: Router;

  constructor(private gigsController: GigsController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.get("/", this.gigsController.get);
    this._router.post("/", this.gigsController.post);
    this._router.post("/:gigID/accept", this.gigsController.accept);
    this._router.post("/:gigID/rate", this.gigsController.rate);
    this._router.get("/toRate", this.gigsController.getGigsToRate);
  }

  public get router(): Router {
    return this._router;
  }
}
