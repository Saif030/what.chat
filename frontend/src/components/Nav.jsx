import { BadgePlus , PanelRight , Settings , Ellipsis , LogOut , MessageCircleQuestionMark , TabletSmartphone , Pencil , Trash2 } from "lucide-react";
import { favicon } from "../assets/assets.js";
import { useContext, useState , useEffect } from "react";
import { ChatContext } from "../context/ChatContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link , useParams, useNavigate } from "react-router-dom";
import qr from '../assets/qr.png'

const Nav = ({ onNewChat , setIsChatStart }) => {

    const { chatStart , getAllChats , chatDelete , renameChat } = useContext(ChatContext);
    const { getUser , logOut } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [IsgetApp, setIsgetApp] = useState(false);
    const [chatHistory, setChatHistory] = useState(null);
    const [editChat, seteditChat] = useState(null)
    const [renameMode, setRenameMode] = useState(null)
    const [renameValue, setRenameValue] = useState('')
    const { chatId } = useParams();
    const navigate = useNavigate();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const userData = async () => {
            const data = await getUser();
            const allChats = await getAllChats();
            setChatHistory(allChats.chats);
            setUserData(data);
        }
        userData();
        
    }, [getUser]);
    
    const handleNewChat = async () => {
        const response = await chatStart();  // Create new backend session
        if (response?.success && response?.chat?._id) {
            setIsChatStart(false);
            // Refresh chat history
            const allChats = await getAllChats();
            setChatHistory(allChats.chats);
            navigate(`/chat/${response.chat._id}`);  // Navigate to new chat
        }
    };

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const logout = () => {
        logOut();
        window.location.reload();
    };

    const handleDeleteChat = async (id) => {
        const response = await chatDelete(id);
        if (response?.success) {
            seteditChat(null);
            // Navigate to home if deleted chat is currently open
            if (chatId === id) {
                navigate('/');
            }
            const allChats = await getAllChats();
            setChatHistory(allChats.chats);
        }
    }

    const handleStartRename = (chat) => {
        setRenameMode(chat._id);
        setRenameValue(chat.title);
        seteditChat(null);
    }

    const handleRenameSubmit = async (id) => {
        if (renameValue.trim()) {
            const response = await renameChat(id, renameValue.trim());
            if (response?.success) {
                setRenameMode(null);
                setRenameValue('');
                const allChats = await getAllChats();
                setChatHistory(allChats.chats);
            }
        }
    }

    const handleRenameKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleRenameSubmit(id);
        } else if (e.key === 'Escape') {
            setRenameMode(null);
            setRenameValue('');
        }
    }

    const chatDetailedit = (id) => {
        seteditChat(editChat === id ? null : id);
    }

    return (
        <>
            {/* Sidebar - always rendered for smooth animation */}
            <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
                <div className="w-64 h-full bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src={favicon} alt="DeepSeek" className="w-8 h-8" />
                            <span className="text-xl font-semibold text-white">what.chat</span>
                        </div>
                        <button 
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <PanelRight className="w-5 h-5 text-neutral-400" />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <div className="px-3 py-2">
                        <button 
                            onClick={handleNewChat}
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#2b2b2b] hover:bg-[#3b3b3b] text-white rounded-full transition-colors text-sm font-medium"
                        >
                            <BadgePlus size={16} />
                            New chat
                        </button>
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                            <div>
                                <div className="space-y-1">
                                    {chatHistory?.map((chat,index) => (
                                        <div key={chat._id} className="relative">
                                        <Link
                                            onClick={() => setIsChatStart(chat.messages.length > 0)}
                                            to={`/chat/${chat._id}`}
                                            className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm text-gray-300 hover:bg-neutral-800 cursor-pointer rounded-xl transition-colors truncate ${
                                                chatId === chat._id ? 'bg-[#2b2b2b]' : ''
                                            }`}
                                        >
                                            {renameMode === chat._id ? (
                                                <input 
                                                    type="text" 
                                                    value={renameValue}
                                                    onChange={(e) => setRenameValue(e.target.value)}
                                                    onKeyDown={(e) => handleRenameKeyDown(e, chat._id)}
                                                    onBlur={() => handleRenameSubmit(chat._id)}
                                                    autoFocus
                                                    className="bg-transparent text-gray-200 border border-gray-600 rounded px-2 py-1 text-sm w-full outline-none focus:border-blue-500"
                                                    onClick={(e) => e.preventDefault()}
                                                />
                                            ) : (
                                                <span>{chat.title}</span>
                                            )}
                                            <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); chatDetailedit(chat._id); }} className="p-1 rounded-full hover:bg-neutral-700"><Ellipsis size={16}/></span>
                                        </Link>
                                        {editChat === chat._id && (
                                            <div className="w-32 bg-neutral-800 p-2 absolute top-full right-0 mt-1 z-10 rounded-xl">
                                                <div className="flex flex-col gap-2">
                                                    <button onClick={() => handleStartRename(chatHistory.find(c => c._id === editChat))} className="w-full flex items-center justify-between hover:bg-black/20 text-left px-3 py-1 text-sm text-gray-300 cursor-pointer rounded-lg transition-colors">
                                                        <span>Edit</span>
                                                        <span className="p-1 rounded-full"><Pencil size={16} /></span>
                                                    </button>
                                                    <button onClick={() => handleDeleteChat(editChat)} className="w-full flex items-center justify-between hover:bg-black/20 text-left px-3 py-1 text-sm text-red-300 cursor-pointer rounded-lg transition-colors">
                                                        <span>Delete</span>
                                                        <span className="p-1 rounded-full"><Trash2 size={16}/></span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                    </div>

                    {/* Footer */}
                    <div onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="px-4 py-2 hover:bg-black/30 rounded-xl m-2 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {userData?.userData?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <span className="text-sm text-gray-300">{userData?.userData?.name}</span>
                                    <span className="text-xs text-gray-500 block">{userData?.userData?.email}</span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer">
                                <Settings className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {isSettingsOpen && (
                        <div onMouseLeave={() => setIsSettingsOpen(false)} className="px-2 py-1 bg-neutral-800 absolute bottom-14 w-[45vw] sm:w-[13vw] left-0 rounded-xl m-2 cursor-pointer">
                            <div onMouseLeave={() => setIsgetApp(false)} onClick={() => setIsgetApp(!IsgetApp)} className="hover:bg-black/30 px-3 text-gray-200 py-2 flex items-center gap-2 text-sm font-medium rounded-lg">
                                <span><TabletSmartphone className="w-4 h-4" /></span>
                                <span>Get Mobile App</span>
                            </div>
                            <div className="hover:bg-black/30 px-3 text-gray-200 py-2 flex items-center gap-2 text-sm font-medium rounded-lg">
                                <span><MessageCircleQuestionMark className="w-4 h-4" /></span>
                                <span>Help & Support</span>
                            </div>
                            <div onClick={() => logout()} className="hover:bg-black/30 px-3 text-gray-200 py-2 flex items-center gap-2 text-sm font-medium rounded-lg">
                                <span><LogOut className="w-4 h-4" /></span>
                                <span>Log out</span>
                            </div>
                        </div>
                    )}

                    {IsgetApp && (
                        <div className="p-2 bg-neutral-800 absolute bottom-14 w-44 h-46 -right-30 rounded-xl m-2 cursor-pointer">
                            <div className="hover:bg-black/30 px-3 text-gray-200 py-2 flex items-center gap-2 text-sm font-medium rounded-lg">
                            <img src={qr} alt="QR Code" className="w-full h-auto" />
                            </div>
                            <p className="text-xs text-gray-300">Scan qr to Download the App</p>
                        </div>
                    )}

                </div>
            </div>

            {/* Nav bar */}
            <nav className="py-4 px-3 flex gap-3 items-center relative">
                <img className ="sm:w-12 sm:block hidden" src={favicon} alt="Logo" />
                <div className="flex gap-4 items-center justify-between sm:justify-normal w-full sm:w-fit sm:bg-neutral-800 px-4 py-3 rounded-full">
                    {isSidebarCollapsed && 
                        <div className="cursor-pointer" onClick={handleToggleSidebar}><PanelRight size={18} /></div>
                    }
                    <div onClick={() => setIsChatStart(false)} className="cursor-pointer"><BadgePlus size={18} onClick={handleNewChat} /></div>
                </div>
            </nav>
        </>
    );
};

export default Nav;