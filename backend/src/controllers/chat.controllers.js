import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import aiResponse from "../utils/llm.js";

const whatChat = async (req,res) => {
    const userId = req.user_id;
    const { prompt , model } = req.body;
    const { chatId } = req.params;

    if(!userId){
        return res.status(401).json({ success:false , message: "Unauthorized" });
    }

    if(!chatId || chatId === "undefined"){
        return res.status(400).json({ success:false , message: "Invalid chat ID" });
    }

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        const response = await aiResponse(prompt,model);

        if(!response){
            return res.status(500).json({ success:false , message: "Internal server error response not get" });
        }

        const aiText = response?.choices?.[0]?.message?.content || "No response";

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                messages: {
                    prompt,
                    response: aiText,
                    createdAt: new Date()
                }
                }
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
            );

            if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
            }



        return res.status(200).json({ success:true , chat , message: aiText });
        
    } catch (error) {
        return res.status(500).json({ success:false , message: "Internal server error", error: error.message });
    }
    
}

const chatCreate = async (req,res) => {
    const userId = req.user_id;

    if(!userId){
        return res.status(401).json({ success:false , message: "Unauthorized" });
    }

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const chat = await Chat.create({
            participant: userId,
            messages: []
        });


        const newChat = await Chat.findById(chat._id);
        return res.status(200).json({ success:true , chat:newChat , message: "Chat created successfully" });
        
    } catch (error) {
        return res.status(500).json({ success:false ,message: "Internal server error", error: error.message });
    }
}

const getChat = async (req, res) => {
    const userId = req.user_id;
    const {chatId} = req.params;

    if(!userId){
        return res.status(401).json({ success:false , message: "Unauthorized" });
    }

    if(!chatId || chatId === "undefined"){
        return res.status(400).json({ success:false , message: "Invalid chat ID" });
    }

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({ message: "Chat not found" });
        }

        return res.status(200).json({ success:true , chat });
        
    } catch (error) {
        return res.status(500).json({ success:false , message: "Internal server error", error: error.message });
    }
}

const getAllChats = async (req, res) => {
    const userId = req.user_id;

    if(!userId){
        return res.status(401).json({ success:false , message: "Unauthorized" });
    }

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const chats = await Chat.find({ participant: userId });
        return res.status(200).json({ success:true , chats });
        
    } catch (error) {
        return res.status(500).json({ success:false , message: "Internal server error", error: error.message });
    }
}

const chatRename = async (req,res) => {
    const { chatId , newTitle } = req.body;

    if(!chatId){
        return res.status(400).json({ success:false , message: "Chat ID is required" });
    }

    try{

        const chat = await Chat.findById(chatId);

        if(!chat){
            return res.status(404).json({ success:false , message: "Chat not found" });
        }

        chat.title = newTitle;
        await chat.save();

        return res.status(200).json({ success:true , chat });

    }catch(err){
        return res.status(500).json({success:false , message: "Internal server error" , error: err.message});
    }
}

const chatDelete = async (req,res) => {
    const { chatId } = req.body;
    if(!chatId){
        return res.status(400).json({ success:false , message: "Chat ID is required" });
    }

    try {
        const chat = await Chat.findByIdAndDelete(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

export {whatChat, chatCreate, getChat, getAllChats, chatRename, chatDelete} 