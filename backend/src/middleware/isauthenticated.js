import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req ,res , next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user_id = decoded.id;
        next();

    }catch(error){
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export {isAuthenticated};
