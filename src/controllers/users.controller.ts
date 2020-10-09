import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import { CreateUser } from "../models";
import threadDBClient from "../threaddb.config";
import { calculateInitialCreditsAmount } from "../services";
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
  public get = async (req: Request, res: Response) => {
    try {
      const response = {};
      res.status(200).send(response);
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
    if(!model.organizationID) {
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
  public post = async (req: Request, res: Response) => {
    try {
    //   {
    //     "organizationId": "01em7cpcfatd4th7afk5t930pd",
    //     "username": "migrenaaa", 
    //     "skillCategories": [
    //         {
    //         "category": "At home",
    //         "skills": [
    //             {
    //                 "skill": "Gardening",
    //                 "level": 8
    //             }
    //         ]
    //     },
    //      {
    //         "category": "Community life",
    //         "skills": [
    //             {
    //                 "skill": "Legal & Proposals",
    //                 "level": 10
    //             }
    //         ]
    //     }]
    // }
      this.validateRegisterBody(req.body);
      const userID = await threadDBClient.insert('Users', req.body);
      const credits = await calculateInitialCreditsAmount(req.body);
      console.log(credits);
      // store the credits on the blockchain
      res.status(201).send({ userID: userID });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
