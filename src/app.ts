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
const cookieParser = require("cookie-parser");
var cors = require('cors');
import { initializeSkillWallet } from './skillWallet/skillWallet.client';
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

    require('dotenv').config()

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

    // const onAuth = (address, done) => {
    //   // optional additional validation. To deny auth:
    //   // done(new Error('User is not authorized.'));
    //   console.log('aaaaaaaa');
    //   const query = new Where('address').eq(address);
    //   threadDBClient.filter(UsersCollection, query).then(users => {
    //     if (users.length > 0)
    //       done(undefined, users[0])
    //     else
    //       done(new Error('User not found'), undefined);
    //   })
    //     .catch(err => done(err, undefined))
    // }

    // const web3Strategy = new Web3Strategy(onAuth);

    // passport.use(web3Strategy);

    // this._app.use(passport.initialize());
    // this._app.use(passport.session());
    this._app.use(cors());
    //Initialize app routes
    this._initRoutes();

    initializeSkillWallet();

  }

  private _initRoutes() {
    this._app.use("/api/docs", this.swaggerRouter.router);
    this._app.use("/api/user", this.userRouter.router);
    this._app.use("/api/skill", this.skillsRouter.router);
    this._app.use("/api/community", this.communityRouter.router);
    this._app.use("/api/gig", this.gigRouter.router);
  }
}