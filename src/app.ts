import consts from "@config/consts";
import api from "api";
import express, { Application } from "express";
import httpContext from "express-http-context";
var cors = require("cors");

const app: Application = express();

app.use(cors({ origin: '*'}));

app.use(httpContext.middleware);
app.use(express.json());

app.use(consts.API_ROOT_PATH, api);





export default app;