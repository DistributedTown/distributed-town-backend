import { LoggerService } from "../services";
import { Response } from "express";
import { injectable } from "inversify";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import { getCommunityDetails, getSkillWallet, hasPendingAuth } from '../services/skillWallet.service';

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
      // return res.status(200).send(skillWallet);
      return res.status(200).send({
        "nickname": "jabyl",
        "imageUrl": "https://png.pngtree.com/png-clipart/20190619/original/pngtree-vector-avatar-icon-png-image_4017288.jpg",
        "diToCredits": 2360,
        "currentCommunity": {
          "name": "DiTo 23",
          "address": "0xE5dFc64faD45122545B0A5B88726ff7858509600"
        },
        "pastCommunities": [
          {
            "name": "DiTo 24",
            "address": "0xE5dFc64faD45122545B0A5B88726ff7858509600"
          },
          {
            "name": "DiTo 25",
            "address": "0xE5dFc64faD45122545B0A5B88726ff7858509600"
          }
        ],
        "skills": [
          {
            "name": "Tokenomics",
            "value": 9
          },
          {
            "name": "Network Design",
            "value": 8
          },
          {
            "name": "Game Theory  ",
            "value": 6
          }
        ]
      });
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

  public hasPendingAuthentication = async (req: any, res: Response) => {
    try {
      const pendingAuth = await hasPendingAuth(req.query.address);
      return res.status(200).send({ hasPendingAuth: pendingAuth });
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
  public activateSkillWallet = async (req: any, res: Response) => {
    try {
      // const isRegistered = SkillWalletContracts.isActive(req.body.tokenId);
      // if (isRegistered) {
      //   return res.status(400).send({ message: "Skill Wallet already activated" });
      // } else {
      await SkillWalletContracts.activate(req.body.tokenId, req.body.hash);
      // if (success)
      return res.status(200).send({ message: "Skill Wallet activated successfully." });
      // else
      //   return res.status(500).send({ message: "Something went wrong!" });
      // }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }
}