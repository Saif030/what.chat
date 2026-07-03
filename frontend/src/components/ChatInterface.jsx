import { useState, useContext, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { favicon } from '../assets/assets.js';
import { Copy, Check } from 'lucide-react';
import { Brain, Globe, ChevronsUpDown, ArrowUp, RotateCcw, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ---- Code block with syntax highlighting + copy button ----
const CodeBlock = ({ inline, className, children }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (inline) {
        return (
            <code className="bg-zinc-700 text-white px-1.5 py-0.5 rounded text-[11px] sm:text-xs break-words">
                {children}
            </code>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="relative my-2 sm:my-3 rounded-lg sm:rounded-xl overflow-hidden border border-zinc-700 max-w-full">
            <div className="flex items-center justify-between bg-zinc-800 px-2.5 sm:px-4 py-1.5 sm:py-2 border-b border-zinc-700">
                <span className="text-[10px] sm:text-xs text-gray-400 font-mono truncate">
                    {match ? match[1] : 'text'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors shrink-0 pl-2"
                >
                    {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={match ? match[1] : 'text'}
                    style={oneDark}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        padding: '0.75rem',
                        background: '#1e1e1e',
                        fontSize: '11px',
                        lineHeight: '1.5',
                    }}
                    codeTagProps={{ style: { fontFamily: 'ui-monospace, monospace' } }}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

const ChatInterface = ({ chatData }) => {
    const { chat, getChat, models } = useContext(ChatContext);
    const { chatId } = useParams();

    const [messages, setMessages] = useState([]);

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
    const [model, setmodel] = useState(models[0] || '');
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        const userMsg = { role: 'user', content: message };
        setMessages(prev => [...prev, userMsg]);

        const loadingMsg = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, loadingMsg]);

        const payload = { prompt: isDeepThink ? 'Reason deeply step by step, showing all your thinking, then answer:' + message : message };
        const response = await chat(chatId, payload, model);

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
        <div className="flex flex-col h-[calc(100vh-64px)] sm:h-[calc(100vh-74px)] bg-zinc-900">
            {/* Messages Area */}
            <div className="box1 scroll-smooth flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <img src={favicon} alt="AI" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full shrink-0" />
                            )}
                            <div className={`min-w-0 max-w-[88%] sm:max-w-[80%] ${msg.role === 'user' ? 'bg-zinc-700 text-white rounded-2xl sm:rounded-full px-3.5 sm:px-4 py-2 text-sm sm:text-base' : 'text-gray-100 text-sm sm:text-base'}`}>
                                {msg.content ?
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => (
                                                <p className="mb-2 sm:mb-0 leading-6 sm:leading-7 text-white break-words">{children}</p>
                                            ),
                                            h1: ({ children }) => (
                                                <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white break-words">{children}</h1>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-5 text-white break-words">{children}</h2>
                                            ),
                                            h3: ({ children }) => (
                                                <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-semibold mb-2 mt-3 sm:mt-4 text-white break-words">{children}</h3>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="list-disc pl-4 sm:pl-6 mb-2 sm:mb-3 text-white">{children}</ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="list-decimal pl-4 sm:pl-6 mb-2 sm:mb-3 text-white">{children}</ol>
                                            ),
                                            li: ({ children }) => (
                                                <li className="mb-1 text-white break-words">{children}</li>
                                            ),
                                            table: ({ children }) => (
                                                <div className="overflow-x-auto my-3 sm:my-4 -mx-1 sm:mx-0 rounded-lg border border-gray-700">
                                                    <table className="w-full border-collapse min-w-[280px] text-xs sm:text-sm">
                                                        {children}
                                                    </table>
                                                </div>
                                            ),
                                            th: ({ children }) => (
                                                <th className="border border-gray-700 px-2 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 text-left text-xs sm:text-sm text-white font-semibold whitespace-nowrap">
                                                    {children}
                                                </th>
                                            ),
                                            td: ({ children }) => (
                                                <td className="border border-gray-700 px-2 sm:px-4 py-1.5 sm:py-2 bg-transparent text-xs sm:text-sm text-white">
                                                    {children}
                                                </td>
                                            ),
                                            code: CodeBlock,
                                            pre: ({ children }) => <>{children}</>,
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-gray-500 pl-3 sm:pl-4 italic my-2 sm:my-3 text-gray-300 text-xs sm:text-sm">
                                                    {children}
                                                </blockquote>
                                            ),
                                            a: ({ children, href }) => (
                                                <a
                                                    href={href}
                                                    className="text-blue-400 hover:underline hover:text-blue-300 break-all"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {children}
                                                </a>
                                            ),
                                            hr: () => (
                                                <hr className="border-gray-700 my-3 sm:my-4" />
                                            ),
                                            strong: ({ children }) => (
                                                <strong className="font-semibold text-white">{children}</strong>
                                            ),
                                            em: ({ children }) => (
                                                <em className="italic text-white">{children}</em>
                                            ),
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown> :
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
                        <div className="flex items-center gap-1 sm:gap-2 mt-2 ml-8 sm:ml-11">
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
            <div className="p-2.5 sm:p-4">
                <div className="max-w-3xl mx-auto bg-[#2b2b2b] rounded-2xl sm:rounded-[1.5rem] p-2.5 sm:p-3 flex flex-col gap-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Message DeepSeek"
                        className="w-full bg-transparent text-gray-200 placeholder-gray-500 px-2 sm:px-3 py-2 resize-none outline-none min-h-[40px] max-h-[200px] overflow-y-auto text-sm sm:text-base"
                        rows="1"
                    />

                    <div className="flex justify-between items-center px-1 pb-1 pt-1 sm:pt-2 gap-2">
                        <div className="flex gap-1.5 sm:gap-2 min-w-0">
                            <button
                                onClick={() => setIsDeepThink(!isDeepThink)}
                                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm transition-colors shrink-0 ${
                                    isDeepThink ? 'bg-blue-900/60 border-blue-500 text-blue-200' : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                <Brain className="w-4 h-4" />
                                <span className="hidden sm:block">DeepThink</span>
                            </button>
                            <button
                                onClick={() => setIsSearch(!isSearch)}
                                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm transition-colors shrink-0 ${
                                    isSearch ? 'bg-blue-900/60 border-blue-500 text-blue-200' : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                                }`}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:block">Search</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <div className="relative inline-block text-left" ref={dropdownRef}>
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 text-[11px] sm:text-xs hover:bg-gray-700/50 transition-colors max-w-[90px] xs:max-w-none"
                                >
                                    <ChevronsUpDown size={14} className="shrink-0" />
                                    <span className="truncate">{model?.name}</span>
                                </button>

                                {open && (
                                    <div className="absolute mt-2 right-0 bottom-11 w-40 bg-[#3b3b3b] border border-gray-600 rounded-xl shadow-lg overflow-hidden z-10">
                                        {models?.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => { setmodel(item); setOpen(false); }}
                                                className="px-4 py-2 text-gray-200 text-sm hover:bg-blue-800 cursor-pointer"
                                            >
                                                {item?.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!message.trim()}
                                className="bg-[#4d6bfe] hover:bg-blue-600 disabled:bg-[#4d6bfe]/50 disabled:text-white/50 disabled:cursor-not-allowed text-white p-1.5 rounded-full transition-colors shrink-0"
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