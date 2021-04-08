import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import { getCommunityDetails, getSkillWallet } from '../services/skillWallet.service';

@injectable()
export class SkillWalletController {
  constructor(
    private loggerService: LoggerService,
  ) { }

  /**
   * @swagger
   * /skillWallet:
   *  get:
   *      description: Returns skill wallet data
   *      tags:
   *          - SkillWallet
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
      const skillWallet = await getSkillWallet(req.query.address);
      return res.status(200).send(skillWallet);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /skillWallet:
   *  get:
   *      description: Returns skill wallet data
   *      tags:
   *          - SkillWallet
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
   public getCommunity = async (req: any, res: Response) => {
    try {
      const skillWallet = await getCommunityDetails(req.query.address);
      return res.status(200).send(skillWallet);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  /**
   * @swagger
   * /skillWallet/register:
   *  post:
   *      description: Validates the skill wallet by scanning the QR code 
   *      tags:
   *          - SkillWallet
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: OK
   *          500:
   *              description: Server error
   */
  public registerSkillWallet = async (req: any, res: Response) => {
    try {
      const isRegistered = SkillWalletContracts.isSkillWalletRegistered(req.body.tokenId);
      if (isRegistered) {
        return res.status(400).send({ message: "Skill wallet already registered" });
      } else {
        const success = await SkillWalletContracts.registerSkillWallet(req.body.tokenId);
        if (success)
          return res.status(200).send({ message: "Skill wallet registered successfully." });
        else
          return res.status(500).send({ message: "Something went wrong!" });
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}