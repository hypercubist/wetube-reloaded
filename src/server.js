import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouters";
import userRouter from "./routers/userRouters";
import videoRouter from "./routers/videoRouters";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

const handleListening = () => {
  console.log(`😎Server listening on port http:/localhost:${PORT}`);
};

app.listen(PORT, handleListening);
