import express from "express";
var bodyParser = require('body-parser')
import helmet from "helmet";
import { injectable } from "inversify";
import {
  SkillWalletRouter,
  SkillsRouter,
  CommunityRouter,
  GigRouter,
  SwaggerRouter,
} from "./routers";
const session = require("express-session");
const cookieParser = require("cookie-parser");
var cors = require('cors');
require('dotenv').config()

@injectable()
export class App {
  private _app: express.Application;

  constructor(
    private skillWalletRouter: SkillWalletRouter,
    private skillsRouter: SkillsRouter,
    private communityRouter: CommunityRouter,
    private gigRouter: GigRouter,
  ) {
    this._app = express();
    this.config();
  }

  public get app(): express.Application {
    return this._app;
  }

  private config(): void {

    // parse application/x-www-form-urlencoded
    this._app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
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

    this._app.use(cors());
    //Initialize app routes
    this._initRoutes();

  }

  private _initRoutes() {
    // this._app.use("/api/docs", this.swaggerRouter.router);
    this._app.use("/api/skillWallet", this.skillWalletRouter.router);
    this._app.use("/api/skill", this.skillsRouter.router);
    this._app.use("/api/community", this.communityRouter.router);
    this._app.use("/api/gig", this.gigRouter.router);
  }
}