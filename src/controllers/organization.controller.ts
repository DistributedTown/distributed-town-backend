import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";

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
  public get = async (req: Request, res: Response) => {
    try {
      var response = await threadDBClient.getAll('Organizations');
      res.status(200).send(response);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

