import express from "express";
import morgan from "morgan";
import session from "express-session";
import globalRouter from "./routers/rootRouters";
import userRouter from "./routers/userRouters";
import videoRouter from "./routers/videoRouters";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "hi!",
    resave: true,
    saveUninitialized: true,
  })
); //router 앞에 위치
app.use(localsMiddleware); //session 뒤에 위치해야 local로 session 정보를 가져올 수 있다.
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app;
