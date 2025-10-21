import { Router } from "express";
import { searchingText } from "../controllers/searchUserText.controller";

const searchUserTextRouter = Router();

searchUserTextRouter.route("/q/:searchText").get(searchingText);

export { searchUserTextRouter };
