import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { injectable } from "inversify";
import * as promBundle from "express-prom-bundle";
import {
  UserRouter,
  SkillsRouter,
  OrganizationRouter,
  GigRouter,
  SwaggerRouter,
} from "./routers";

@injectable()
export class App {
  private _app: express.Application;

  constructor(
    private userRouter: UserRouter,
    private skillsRouter: SkillsRouter,
    private organizationRouter: OrganizationRouter,
    private gigRouter: GigRouter,
    private swaggerRouter: SwaggerRouter
  ) {
    this._app = express();
    this.config();
  }

  public get app(): express.Application {
    return this._app;
  }

  private config(): void {
    const metricsMiddleware = promBundle({
      includeMethod: true,
      includePath: true
    });
    this._app.use(metricsMiddleware);

    // support application/json
    this._app.use(bodyParser.json());
    // helmet security
    this._app.use(helmet());
    //support application/x-www-form-urlencoded post data
    this._app.use(bodyParser.urlencoded({ extended: false }));
    //Initialize app routes
    this._initRoutes();
  }

  private _initRoutes() {
    this._app.use("/api/docs", this.swaggerRouter.router);
    this._app.use("/api/user", this.userRouter.router);
    this._app.use("/api/skill", this.skillsRouter.router);
    this._app.use("/api/gig", this.gigRouter.router);
    this._app.use("/api/organization", this.organizationRouter.router);
  }
}
