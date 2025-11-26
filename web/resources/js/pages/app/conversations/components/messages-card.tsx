import { Message } from './table';
import { SmilePlus, Frown, Headset, ShieldQuestion } from 'lucide-react';

interface MessageCardProps {
    message: Message;
}

function MessageCard({ message }: MessageCardProps) {
    const isUser = message.role === "user";

    return (
        <div className={`shadow-sm rounded-xl p-5 ${isUser ? 'bg-[#2a2251] text-white' : 'bg-white dark:bg-zinc-800'}`}>
            {/* Header */}
            <header className="flex justify-between items-start space-x-3 mb-3">
                {/* User */}
                <div className="flex items-start space-x-3">
                    {/* <img
                        className="rounded-full shrink-0"
                        src={isUser ? "/images/user-40-03.jpg" : "/images/assistant-avatar.png"}
                        width="40"
                        height="40"
                        alt={isUser ? "Usuario" : "Asistente"}
                    /> */}
                    <div>
                        <div className="leading-tight">
                            <a className="text-sm font-semibold text-gray-800 dark:text-gray-100" href="#0">
                                {isUser ? "Cliente" : "Asistente"}
                            </a>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</div>
                    </div>
                </div>
                {/* Menu button */}
                <div className="relative">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        ⋮
                    </button>
                </div>
            </header>

            {/* Body */}
            <div className="text-sm text-gray-800 dark:text-gray-100 space-y-2 mb-5">
                <p>{message.message_content}</p>
            </div>

            {/* Footer */}
            <footer className="flex items-center space-x-4">
                {/* Like button */}
                {message.sentiment === 'positive' && (
                    <button className="flex items-center text-gray-400 dark:text-gray-500 hover:text-violet-500">
                        <SmilePlus className='w-5' />
                        <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Positivo</div>
                    </button>
                )}
                {message.sentiment === 'negative' && (
                    <button className="flex items-center text-gray-400 dark:text-gray-500 hover:text-violet-500">
                        <Frown className='w-5' />
                        <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Negativo</div>
                    </button>
                )}
                {message.sentiment === 'duda' && (
                    <button className="flex items-center text-gray-400 dark:text-gray-500 hover:text-violet-500">
                        <ShieldQuestion className='w-5' />
                        <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Duda</div>
                    </button>
                )}
                {message.sentiment === 'support' && (
                    <button className="flex items-center text-gray-400 dark:text-gray-500 hover:text-violet-500">
                        <Headset className='w-5' />
                        <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Soporte</div>
                    </button>
                )}
            </footer>
        </div>
    );
}

export default MessageCard;