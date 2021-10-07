import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/rootRouters";
import userRouter from "./routers/userRouters";
import videoRouter from "./routers/videoRouters";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
); //router 앞에 위치
app.use(localsMiddleware); //session 뒤에 위치해야 local로 session 정보를 가져올 수 있다.
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/api", apiRouter);

export default app;
