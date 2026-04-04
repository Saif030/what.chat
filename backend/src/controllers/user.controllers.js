import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const getUser = async (req, res) => {
    const userId = req.user_id;

    if(!userId){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User found" , userData : user });

    }catch(err){
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }

};

const registerUser = async (req,res) => {
    const { name, email, password , confirmPassword } = req.body;

    if(!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if(password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try{
        const isUserExists = await User.findOne({ email });

        if(isUserExists){
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        if(!user){
            return res.status(400).json({ message: "User not created" });
        }

        return res.status(201).json({ message: "User created successfully" , userData : user });

    }catch(err){
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

const login = async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        };

        return res.status(200).cookie("token", token, cookieOptions).json({ message: "Login successful" , success:true });

    }catch(err){
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

const logout = async (req,res) => {
    try{
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0
        };
        return res.status(200).clearCookie("token", cookieOptions).json({ message: "Logout successful" , success:true });
    }catch(err){
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export { getUser, registerUser, login , logout };