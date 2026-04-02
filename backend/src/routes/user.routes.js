import { Router } from "express";
import { getUser, registerUser , login , logout } from "../controllers/user.controllers.js";
import {isAuthenticated} from "../middleware/isauthenticated.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("your are in user route");
});
router.get("/me", isAuthenticated, getUser);
router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

export default router;
