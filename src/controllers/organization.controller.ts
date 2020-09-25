import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import { Organization } from "../models";

@injectable()
export class OrganizationController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /:
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
      const response = [
        {
        id: "ba60a22e-2178-4d58-bf47-c9d337c093ba", 
        name: "Org1",
        scarcityScore: 60
      },
      {
        id: "ba60a22e-2178-4d58-bf47-c9d337c093as", 
        name: "Org2",
        scarcityScore: 70
      },
    ]
      res.status(200).send(response);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}

