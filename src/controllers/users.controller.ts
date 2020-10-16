import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { fillUserData, validateUser } from "../services/user.service";
import threadDBClient from "../threaddb.config";
import { Where } from "@textile/hub";
import { UsersCollection } from "../constants/constants";
const { Magic } = require("@magic-sdk/admin");
const magic = new Magic('sk_live_B4234DDF6AE0251D');

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
      if (req.isAuthenticated()) {
        const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
        const query = new Where('email').eq(userMetadata.email);
        const user = (await threadDBClient.filter(UsersCollection, query));
        return res.status(200).send(user);
      }
      else
        return res.status(401).send({ message: `User is not logged in.` });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

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
      if (req.isAuthenticated()) {
        const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
        const validationResult = await validateUser(req.body);
        if (validationResult.isValid) {
          const response = await fillUserData(userMetadata.email, req.body);
          res.status(201).send(response);
        } else {
          res.status(400).send({ message: validationResult.message });
        }
      } else {
        return res.status(401).end({ message: 'Could not log user in.' });
      }
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
      if (req.user) {
        res.status(200).end('User is logged in.');
      } else {
        return res.status(401).end({ message: 'Could not log user in.' });
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
        return res.status(401).end({ message: `User is not logged in.` });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}