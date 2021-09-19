import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/rootRouters";
import userRouter from "./routers/userRouters";
import videoRouter from "./routers/videoRouters";

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app;
