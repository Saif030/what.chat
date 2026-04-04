import { useState, useContext , useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { favicon } from '../assets/assets.js';
import { Brain, Globe , ArrowUp, X, FileText , ChevronsUpDown} from 'lucide-react';
import { ChatContext } from '../context/ChatContext';

const Center = ({ isChatStart }) => {
    const { chat, chatStart , models } = useContext(ChatContext);
    const navigate = useNavigate();
    const [isSearch, setIsSearch] = useState(false);
    const [message, setMessage] = useState('');
    
    const [isDeepThink, setIsDeepThink] = useState(false);
    const [model , setmodel] = useState(models[0] || '')

    const textareaRef = useRef(null);

    const handleTextChange = (e) => {
        setMessage(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

      // close when clicking outside
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleSubmit = async () => {

        const payload = {
            prompt: isDeepThink ? message + "explain in detail with examples" : message,
        };
        
        // First create the chat session, then send the message
        const session = await chatStart();
        if (session?.success && session?.chat?._id) {
            const chatId = session.chat._id;
            const response = await chat(chatId, payload,model);
            if(response){
                isChatStart(response)
                navigate(`/chat/${chatId}`)
            }
        }

        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col items-center w-full px-4 mt-[25vh]">
            <div className="flex justify-center items-center gap-3 mb-8">
                <img className="h-8 w-auto" src={favicon} alt="Logo" />
                <p className="text-2xl font-semibold text-gray-100">How can I help you?</p>
            </div>


             {/* center chat box */}
            <div className="w-full max-w-2xl bg-[#2b2b2b] rounded-[1.5rem] p-3 flex flex-col gap-2 transition-all duration-200">
                <textarea 
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Message DeepSeek" 
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 px-3 py-2 resize-none outline-none min-h-[40px] max-h-[200px] overflow-y-auto"
                    rows="1"
                ></textarea>
                
                {/* low priority: add file upload button */}
                <div className="flex justify-between items-center px-1 pb-1 pt-2">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsDeepThink(!isDeepThink)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                                isDeepThink 
                                ? 'bg-blue-900/60 border-blue-500 text-blue-200' 
                                : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                            }`}
                        >
                            <Brain className="w-4 h-4" />
                            <span className='hidden sm:block'>DeepThink</span>
                        </button>
                        
                        <button 
                            onClick={() => setIsSearch(!isSearch)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                                isSearch 
                                ? 'bg-blue-900/60 border-blue-500 text-blue-200' 
                                : 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                            }`}
                        >
                            <Globe className="w-4 h-4" />
                            <span className='hidden sm:block'>Search</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2"> 
                       <div className="relative inline-block text-left" ref={dropdownRef}>
                            {/* Button */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 text-xs hover:bg-gray-700/50 transition-colors"
                            >
                                <ChevronsUpDown size={14}/>
                                {model?.name}
                            </button>

                            {/* Dropdown */}
                            {open && (
                                <div className="absolute mt-2 w-40 bg-[#3b3b3b] border border-gray-600 rounded-xl shadow-lg overflow-hidden z-10">
                                    {
                                        models?.map((item, index) => (
                                            <div key={index} onClick={() => setmodel(item)} className="px-4 py-2 text-gray-200 text-sm hover:bg-gray-700/50 cursor-pointer">
                                                {item?.name}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                       </div>
                                        
                        <button
                            onClick={handleSubmit}
                            className="bg-[#4d6bfe] hover:bg-blue-600 text-white p-1.5 rounded-full transition-colors flex items-center justify-center"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Center;