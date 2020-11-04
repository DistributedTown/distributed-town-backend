import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { acceptGig, createGig, getGigs, rateGig, validateAcceptingGig, validateGig } from "../services/gig.service";

const { Magic } = require("@magic-sdk/admin");
const magic = new Magic('sk_test_A040E804B3F17845');

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
   *      parameters:
   *          - in: query
   *            name: isOpen
   *            type: boolean
   *            required: true
   *          - in: query
   *            name: isProject
   *            type: boolean
   *            required: true
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
        const isOpen: boolean = req.query.isOpen === 'true';
        const isProject: boolean = req.query.isProject === 'true';
        const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
        const gigs = await getGigs(userMetadata.email, isOpen, isProject);
        res.status(200).send(gigs);
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

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
  public post = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        req.body.isOpen = true;
        const validationResult = await validateGig(req.body);
        if (validationResult.isValid) {
          const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
          const gigID = await createGig(userMetadata.email, req.body);
          res.status(201).send({ gigID: gigID });
        } else {
          res.status(400).send({ message: validationResult.message });
        }
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }

    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /gig/:gigID/accept:
   *  post:
   *      description: Complete a gig
   *      parameters:
   *          - name: AcceptGig
   *            type: AcceptGig
   *            in: body
   *            schema:
   *               $ref: '#/definitions/AcceptGig'
   *      tags:
   *          - Gigs
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: Completed
   *          400:
   *              description: Bad Request
   *          500:
   *              description: Server error
   */
  public accept = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        const validationResult = await validateAcceptingGig(req.params.gigID, req.body.userID);
        if (validationResult.isValid) {
          await acceptGig(req.params.gigID, req.body.userID);
          res.status(200).send();
        } else {
          res.status(400).send({ message: validationResult.message });
        }
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /gig/:gigID/rate:
   *  post:
   *      description: Rates a gig
   *      parameters:
   *          - name: RateGig
   *            type: RateGig
   *            in: body
   *            schema:
   *               $ref: '#/definitions/RateGig'
   *      tags:
   *          - Gigs
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: Completed
   *          400:
   *              description: Bad Request
   *          500:
   *              description: Server error
   */
  public rate = async (req: any, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        const userMetadata = await magic.users.getMetadataByIssuer(req.user.issuer);
        await rateGig(userMetadata.email, req.params.gigID, req.body.rate);
        res.status(200).send();
      } else {
        return res.status(401).end({ message: `User is not logged in.` });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}
