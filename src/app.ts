import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { injectable } from "inversify";
import * as promBundle from "express-prom-bundle";
import {
  UserRouter,
  SkillsRouter,
  CommunityRouter,
  GigRouter,
  SwaggerRouter,
} from "./routers";
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var cors = require('cors');

@injectable()
export class App {
  private _app: express.Application;

  constructor(
    private userRouter: UserRouter,
    private skillsRouter: SkillsRouter,
    private communityRouter: CommunityRouter,
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

    this._app.use(cookieParser());

    this._app.use(
      session({
        secret: "not my cat's name",
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 60 * 60 * 1000, // 1 hour
          // secure: true, // Uncomment this line to enforce HTTPS protocol.
          sameSite: true
        }
      })
    );
    this._app.use(passport.initialize());
    this._app.use(passport.session());
    this._app.use(cors());
    //Initialize app routes
    this._initRoutes();

  }

  private _initRoutes() {
    this._app.use("/api/docs", this.swaggerRouter.router);
    this._app.use("/api/user",passport.authenticate("magic"),  this.userRouter.router);
    this._app.use("/api/skill",  this.skillsRouter.router);
    this._app.use("/api/community", this.communityRouter.router);
    this._app.use("/api/gig", passport.authenticate("magic"), this.gigRouter.router);
  }
}