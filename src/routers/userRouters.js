import express from "express";
import {
  logout,
  getEdit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userControllers";
import {
  publicOnlyMiddleware,
  protectorMiddleware,
  uploadFiles,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", see);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
