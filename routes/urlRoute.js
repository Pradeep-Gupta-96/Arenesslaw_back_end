import express from "express";
import { shortURL } from "../controllers/urlController.js";

export const urlRouter=express.Router()


urlRouter.get('/:shortid',shortURL)

