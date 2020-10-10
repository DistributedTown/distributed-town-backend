import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";
import { OrganizationsCollection } from "../constants/constants";

@injectable()
export class OrganizationController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /organization:
   *  get:
   *      description: Gets all organizations from the database
   *      tags:
   *          - Organization
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
      // if (req.isAuthenticated()) {
        var response = await threadDBClient.getAll(OrganizationsCollection);
        res.status(200).send(response);
      // } else {
      //   res.status(401).send( { error: 'User not logged in.'} );
      // }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

