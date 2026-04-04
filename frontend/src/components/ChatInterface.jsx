import { useState, useContext, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { favicon } from '../assets/assets.js';
import { Copy } from 'lucide-react';
import { Brain, Globe,ChevronsUpDown, ArrowUp, RotateCcw, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatInterface = ({ chatData }) => {
    const { chat , getChat , models } = useContext(ChatContext);
    const { chatId } = useParams();
    
    const [messages, setMessages] = useState([]);

    //code block component for markdown
    function CodeBlock({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");

    const code = String(children).replace(/\n$/, "");

    const copyCode = () => {
       navigator.clipboard.writeText(code);
      };

    return !inline && match ? (
    <div className='w-[77vw] sm:w-[45vw]' style={{ position: "relative" }}>
      <button
        onClick={copyCode}
        style={{
          position: "absolute",
          right: 5,
          top: 5,
          cursor: "pointer",
        }}
        className='hover:bg-black/20 p-2 rounded-full'
      >
        <Copy size={18}/>
      </button>

      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        wrapLongLines
        customStyle={{
            width: "100%",
            borderRadius: "12px",
            padding: "20px",
            fontSize: "14px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
      ) : (
    <code>{children}</code>
      );
    }

    useEffect(() => {
        const fetchMessages = async () => {
            if (!chatId) return;
            const res = await getChat(chatId);
            if (res?.success && res?.chat?.messages) {
                const msgs = res.chat.messages.flatMap(m => [
                    { role: 'user', content: m.prompt },
                    { role: 'assistant', content: m.response }
                ]);
                setMessages(msgs);
            }
        };
        fetchMessages();
    }, [chatId]);

    const [message, setMessage] = useState('');
    const [isDeepThink, setIsDeepThink] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const textareaRef = useRef(null);

    const handleTextChange = (e) => {
        setMessage(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    const [open, setOpen] = useState(false);
    const [model , setmodel] = useState(models[0] || '')
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

        const userMsg = { role: 'user', content: message };
        setMessages(prev => [...prev, userMsg]);

        const loadingMsg = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, loadingMsg]);

        const payload = { prompt: isDeepThink ? "Reason deeply step by step, showing all your thinking, then answer:" + message : message };
        const response = await chat(chatId, payload , model);

        const aiContent = response?.message || 'I received your message!';
        setMessages(prev => prev.map((msg, idx) => 
            idx === prev.length - 1 && msg.role === 'assistant' 
                ? { ...msg, content: aiContent } 
                : msg
        ));

        setMessage('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-74px)] bg-zinc-900">
            {/* Messages Area */}
            <div className="box1 scroll-smooth flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <img src={favicon} alt="AI" className="w-8 h-8 mr-3 rounded-full" />
                            )}
                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-zinc-700 text-white rounded-full px-4 py-2' : 'text-gray-100'}`}>
                                { msg.content ? <ReactMarkdown components={{ code: CodeBlock }}>{msg.content}</ReactMarkdown> : 
                                    <div className="h-8 flex items-center">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        </div>
                                    </div> 
                                }
                            </div>
                        </div>
                    ))}
          
                    {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-2 ml-11">
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4">
                <div className="max-w-3xl mx-auto bg-[#2b2b2b] rounded-[1.5rem] p-3 flex flex-col gap-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Message DeepSeek"
                        className="w-full bg-transparent text-gray-200 placeholder-gray-500 px-3 py-2 resize-none outline-none min-h-[40px] max-h-[200px] overflow-y-auto"
                        rows="1"
                    />

                    <div className="flex justify-between items-center px-1 pb-1 pt-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsDeepThink(!isDeepThink)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                                    isDeepThink ? 'bg-blue-900/60 border-blue-500 text-blue-200' : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                <Brain className="w-4 h-4" />
                                <span className='hidden sm:block'>DeepThink</span>
                            </button>
                            <button
                                onClick={() => setIsSearch(!isSearch)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                                    isSearch ? 'bg-blue-900/60 border-blue-500 text-blue-200' : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
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
                                    <div className="absolute mt-2 right-0 bottom-11 w-40 bg-[#3b3b3b] border border-gray-600 rounded-xl shadow-lg overflow-hidden z-10">
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
                                className="bg-[#4d6bfe] hover:bg-blue-600 disabled:bg-[#4d6bfe]/50 disabled:text-white/50 disabled:cursor-not-allowed text-white p-1.5 rounded-full transition-colors"
                            >
                                <ArrowUp className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
