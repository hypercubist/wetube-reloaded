import express from "express";
import { logout, edit, remove, see } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", see);
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;
