import { LoggerService } from "../services";
import { Request, Response } from "express";
import { injectable } from "inversify";
import threadDBClient from "../threaddb.config";
@injectable()
export class GigsController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /gig:
   *  get:
   *      description: Gets all open gigs from the database
   *      tags:
   *          - Gigs
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
      const gigs = await threadDBClient.getAll('Gigs');
      res.status(200).send(gigs);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  // validateGigBody = (model: any) => {
  //   if (!model.userID) {
  //     throw Error('Username is required.');
  //   }
  //   if (!model.title) {
  //     throw Error('Title is required.');
  //   }
  //   if(!model.organizationID) {
  //     throw Error('Organization is required.');
  //   }
  //   // validate organization -> if it exists, if it has free slot (members < 24);
  // };

  /**
   * @swagger
   * /gig:
   *  post:
   *      description: Opens a gig
   *      parameters:
   *          - name: Gig
   *            type: Gig
   *            in: body
   *            schema:
   *               $ref: '#/definitions/CreateGig'
   *      tags:
   *          - Gigs
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
      const gigID = await threadDBClient.insert("Gigs", req.body);
      // store the credits on the blockchain
      res.status(201).send({ gigID: gigID });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
