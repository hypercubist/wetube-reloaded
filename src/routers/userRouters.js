import express from "express";
import {
  logout,
  getEdit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", see);
userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
