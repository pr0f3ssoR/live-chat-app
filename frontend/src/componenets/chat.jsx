import React from 'react'
import { Link } from 'react-router-dom'

function Chat({ chat, avatar }) {
    return (
        <Link to={`/conversations/${chat.conv_id}`}
            state={{ 'name': chat.username }}
            className="block px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors duration-300 group">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="text-2xl">{avatar}</div>
                    <div className="flex-1">
                        <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors duration-300">
                            {chat.username}
                        </h3>
                        {/* <p className="text-white/60 text-sm truncate">{(chat.last_message.sender === 'me' ? 'You: ' : '') + chat.last_message.text}</p> */}
                        <p className="text-white/60 text-sm truncate">{chat.last_message}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white/50 text-xs mb-1">{chat.time}</p>
                    {/* <span className={`${chat.last_message.sender==='other' ? 'bg-purple-500' : ''} text-white text-xs px-2 py-1 rounded-full`}>
                            {chat.last_message.sender === 'other' ? chat.unread_messages : chat.last_message.sender_status.charAt(0).toUpperCase() + chat.last_message.sender_status.slice(1)}
                        </span> */}
                    {/* <span className='text-white text-m px-2 py-1 rounded-full'>
                        {chat.status}
                        </span> */}
                    {chat.status === 'unread' ? (
                        <div class="relative inline-flex">
                        <span class="absolute right-0 top-0 block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></span>
                    </div>
                    ): (<span className='text-white text-m px-2 py-1 rounded-full'>
                        {chat.status}
                        </span>)}
                </div>
            </div>
        </Link>
    )
}

export default Chat