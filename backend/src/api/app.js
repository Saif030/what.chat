import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/user.routes.js";
import chatRouter from "../routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowOrigin = ["http://localhost:5173", "https://whatt-chat.vercel.app"];
app.use(cors({
    origin: allowOrigin,
    credentials: true
}));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);

export default app;
