import { Router } from "express";
import { injectable } from "inversify";
import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";

@injectable()
export class SwaggerRouter {
  private _router: Router;

  public constructor() {
    this._router = Router();
    this.init();
  }

  public get router(): Router {
    return this._router;
  }

  private init() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "Accountable Test API",
          description: "Accountable Test API definition"
        },
        host: `${process.env.ENVIRONMENT_IP}:${process.env.SERVER_PORT}`,
        basePath: "/api",
        securityDefinitions: {
          jwt: {
            type: "apiKey",
            in: "header",
            name: "Authorization"
          }
        },
        security: [
          {
            jwt: [] as any
          }
        ]
      },
      apis: ["./src/controllers/*.ts", "./src/models/*.ts"]
    };

    const swaggerSpec = swaggerJSDoc(options);

    this._router.get("/json", function(req, res) {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    this._router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}
