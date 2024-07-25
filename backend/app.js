import express from "express";
import userRoute from "./routes/user.route.js";
import bodyparser from "body-parser";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import accountRoute from "./routes/account.route.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();
app.use(bodyparser.json());
app.use(cookieparser());
app.use(morgan("dev"));
const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOption));
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/account", accountRoute);

export default app;
