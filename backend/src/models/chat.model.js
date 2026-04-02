import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "New Chat"
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    messages: [
        {
            prompt: {
                type : String,
                default : ""
            },
            response: {
                type : String,
                default : ""
            }
        }
    ]
}, { timestamps: true })

export const Chat = mongoose.model("Chat", chatSchema)