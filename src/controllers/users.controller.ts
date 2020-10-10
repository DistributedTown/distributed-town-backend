import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";
import { calculateInitialCreditsAmount } from "../services";
import { UsersCollection } from "../constants/constants";

const { Magic } = require("@magic-sdk/admin");
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

@injectable()
export class UsersController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /user:
   *  get:
   *      description: Gets all users from the database
   *      tags:
   *          - Users
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public get = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated())
        return res
          .status(200)
          .json(req.user)
          .end();
      else
        return res.status(401).end(`User is not logged in.`);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  validateRegisterBody = (model: any) => {
    if (!model.username) {
      throw Error('Username is required.');
    }
    if (model.skillCategories.length == 0) {
      throw Error('User should enter some skills is required.');
    }
    if (!model.organizationID) {
      throw Error('Organization is required.');
    }
    // validate organization -> if it exists, if it has free slot (members < 24);
  };

  /**
   * @swagger
   * /user:
   *  post:
   *      description: Creates a new user
   *      parameters:
   *          - name: User
   *            type: User
   *            in: body
   *            schema:
   *               $ref: '#/definitions/CreateUser'
   *      tags:
   *          - Users
   *      produces:
   *          - application/json
   *      responses:
   *          201:
   *              description: Created
   *          400:
   *              description: Bad Request
   *          500:
   *              description: Server error
   */
  public post = async (req: any, res: Response) => {
    try {

      this.validateRegisterBody(req.body);
      const userID = await threadDBClient.insert(UsersCollection, req.body);
      const credits = await calculateInitialCreditsAmount(req.body);
      console.log(credits);
      // store the credits on the blockchain
      res.status(201).send({ userID: userID });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
  /**
     * @swagger
     * /user/login:
     *  post:
     *      description: Login with magic link
     *      tags:
     *          - Users
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Created
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Server error
     */
  public login = async (req: any, res: Response) => {
    try {

      // console.log('aaaaaaaaaaaaaaaaaaa');
      // const didToken = await magic.auth.loginWithMagicLink({ email: 'mimonova13@gmail.com' });
      // console.log(didToken);
      if (req.user) {
        res.status(200).end('User is logged in.');
      } else {
        return res.status(401).end('Could not log user in.');
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
  public logout = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        await magic.users.logoutByIssuer(req.user.issuer);
        req.logout();
        return res.status(200).end();
      } else {
        return res.status(401).end(`User is not logged in.`);
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}