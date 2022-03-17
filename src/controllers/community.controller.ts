import * as services from "../services";
import { Response } from "express";
import { injectable } from "inversify";

@injectable()
export class CommunityController {
  constructor(
    private loggerService: services.LoggerService,
  ) { }

  public get = async (req: any, res: Response) => {
    try {
      let template = req.query.template;
      const com = await services.getCommunities(template);
      res.status(200).send(com);
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }


  public getByAddress = async (req: any, res: Response) => {
    try {
      let address = req.params.address;
      console.log(address);
      if (address) {
        const com = await services.getCommunity(address);
        res.status(200).send(com);
      } else {
        res.status(400).send({ error: "Pass community address." })
      }
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

  public getGigs = async (req: any, res: Response) => {
    try {
      const gigs = await services.getGigs(req.params.communityAddress);
      res.status(201).send({ gigs });
    } catch (err) {
      this.loggerService.error(err);
      res.status(500).send({ error: "Something went wrong, please try again later." });
    }
  }

}

