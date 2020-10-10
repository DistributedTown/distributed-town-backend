import { injectable } from "inversify";
import { Router } from "express";
import { UsersController } from "../controllers";
import threadDBClient from "../threaddb.config";
import { Where } from "@textile/hub";
import { UsersCollection, UsersCollectionTestMagic } from "../constants/constants";

/* 1️⃣ Setup Magic Admin SDK */
const { Magic } = require("@magic-sdk/admin");
const magic = new Magic('sk_test_A040E804B3F17845');

/* 2️⃣ Implement Auth Strategy */
const passport = require("passport");
const MagicStrategy = require("passport-magic").Strategy;

const strategy = new MagicStrategy(async function (user, done) {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
  // const existingUser = await users.findOne({ issuer: user.issuer });
  const query = new Where('issuer').eq(user.issuer);
  const existingUser = await threadDBClient.filter(UsersCollection, query);
  if (!existingUser) {
    /* Create new user if doesn't exist */
    return signup(user, userMetadata, done);
  } else {
    /* Login user if otherwise */
    return login(user, done);
  }
});

passport.use(strategy);


/* 3️⃣ Implement Auth Behaviors */

/* Implement User Signup */
const signup = async (user, userMetadata, done) => {
  // TODO change model
  let newUser = {
    issuer: user.issuer,
    email: userMetadata.email,
    lastLoginAt: user.claim.iat
  };
  await threadDBClient.insert(UsersCollectionTestMagic, newUser);
  return done(null, newUser);
};

/* Implement User Login */
const login = async (user, done) => {
  /* Replay attack protection (https://go.magic.link/replay-attack) */
  if (user.claim.iat <= user.lastLoginAt) {
    return done(null, false, {
      message: `Replay attack detected for user ${user.issuer}}.`
    });
  }
  return done(null, user);
};

passport.serializeUser((user, done) => {
  done(null, user.issuer);
});

/* Populates user data in the req.user object */
passport.deserializeUser(async (id, done) => {
  try {
    const query = new Where('issuer').eq(id);
    const user = await threadDBClient.filter(UsersCollection, query);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
@injectable()
export class UserRouter {
  private readonly _router: Router;

  constructor(private userController: UsersController) {
    this._router = Router({ strict: true });
    this.init();
  }

  private init(): void {
    this._router.post('/', this.userController.post);
    this._router.post('/login', this.userController.login);
    this._router.post('/logout', this.userController.logout);
    this._router.get('/', this.userController.get);
  }

  public get router(): Router {
    return this._router;
  }
}
