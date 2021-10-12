import express from "express";
import { countView, createComment } from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", countView);
apiRouter.post("/video/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;
