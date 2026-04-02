import Center from "../../components/Center";
import ChatInterface from "../../components/ChatInterface";
import { useState } from "react";
import Nav from "../../components/Nav";

const Home = () => {
    const [chatstart, setchatstart] = useState(false);
    const [chatData, setChatData] = useState(null);

    const isChatStart = (data) => {
        if (data) {
            setchatstart(true);
        }
        setChatData(data);        
    }

    const handleNewChat = () => {
        setchatstart(false);
        setChatData(null);
    }

    return (
        <div className="min-h-screen text-white bg-zinc-900 flex flex-col">
            <Nav onNewChat={handleNewChat} setIsChatStart={setchatstart} />
            { chatstart ? <ChatInterface chatData={chatData} /> : <Center isChatStart={isChatStart} />}
       
        </div>
    )
}

export default Home;