import { Router } from "express";
import {isAuthenticated} from "../middleware/isauthenticated.js";
import { whatChat , chatCreate , getChat , getAllChats , chatRename , chatDelete } from "../controllers/chat.controllers.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("your are in chat route");
});

router.get("/create-chat", isAuthenticated, chatCreate);
router.post("/start-chat/:chatId", isAuthenticated, whatChat);
router.get("/get-chat/:chatId", isAuthenticated, getChat);
router.get("/get-all-chats", isAuthenticated, getAllChats);
router.post("/rename-chat", isAuthenticated, chatRename);
router.post("/delete-chat", isAuthenticated, chatDelete);

export default router;
