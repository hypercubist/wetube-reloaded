import express from "express";
import {
  countView,
  createComment,
  deleteComment,
} from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", countView);
apiRouter
  .route("/video/:id([0-9a-f]{24})/comment")
  .post(createComment)
  .delete(deleteComment);
export default apiRouter;
