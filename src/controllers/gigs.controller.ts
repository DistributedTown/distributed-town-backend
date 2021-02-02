import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import {
  takeGig,
  createGig,
  getGigs,
  validateGig,
  getGigsToRate,
  startGig,
  submitGig,
  completeGig,
  validateHash
} from "../services/gig.service";
import { validateRegisteredUser } from "../services/user.service";

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
      if (req.get('skillWalletID')) {
        const isOpen: boolean = req.query.isOpen === 'true';
        const isProject: boolean = req.query.isProject === 'true';
        const isValidUser = await validateRegisteredUser(req.get('skillWalletID'))
        if (isValidUser.valid) {
          const gigs = await getGigs(req.get('skillWalletID'), isOpen, isProject);
          res.status(200).send(gigs);
        } else {
          res.status(400).send({ error: isValidUser.message });
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
      if (req.get('skillWalletID')) {
        const validationResult = await validateGig(req.body, req.get('skillWalletID'));
        if (validationResult.isValid) {
          const gigResult = await createGig(req.get('skillWalletID'), req.body);
          res.status(201).send(gigResult);
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
   * /gig/:gigID/take:
   *  post:
   *      description: Complete a gig
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
  public take = async (req: any, res: Response) => {
    try {
      if (req.get('skillWalletID')) {
        const validationResult = await takeGig(req.params.gigID, req.get('skillWalletID'));
        if (validationResult.isValid) {
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
   * /gig/start:
   *  get:
   *      description: Start a gig
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
  public start = async (req: any, res: Response) => {
    try {
      const validationResult = await startGig(req.params.gigID, req.query.takerID, req.query.creatorID);
      if (validationResult.isValid) {
        res.status(200).send();
      } else {
        res.status(400).send({ message: validationResult.message });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /gig/:gigID/submit:
   *  post:
   *      description: Start a gig
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
  public submit = async (req: any, res: Response) => {
    try {
      if (req.get('skillWalletID')) {
        const validationResult = await submitGig(req.params.gigID, req.get('skillWalletID'));
        if (validationResult.isValid)
          return res.status(200).send();
        else
          return res.status(400).send({ message: validationResult.message })
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
   * /gig/complete:
   *  get:
   *      description: Start a gig
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
  public complete = async (req: any, res: Response) => {
    try {
      const validationResult = await completeGig(req.params.gigID, req.query.creatorID);
      if (validationResult.isValid) {
        res.status(200).send();
      } else {
        res.status(400).send({ message: validationResult.message });
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
      if (req.get('skillWalletID')) {
        // TODO: rate gigs
        // await rateGig(req.get('skillWalletID'), req.params.gigID, req.body.rate);
        res.status(200).send();
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
   * /gigs/toRate:
   *  get:
   *      description: Gets all completed gigs placed by the current user so that the user can rate them
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
  public getGigsToRate = async (req: any, res: Response) => {
    try {
      if (req.get('skillWalletID')) {
        const response = await getGigsToRate(req.get('skillWalletID'));
        res.status(200).send(response);
      } else {
        return res.status(401).end({ message: 'Could not log user in.' });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public validateGigHash = async (req: any, res: Response) => {
    const isMock: boolean = req.query.isMock === 'true';
    if (isMock) {
      res.status(200).send({ isValid: true });
    } else {
      const isValid = await validateHash(req.params.gigID, req.query.communityID, req.query.hash);
      res.status(200).send({ isValid });
    }
  }
}
