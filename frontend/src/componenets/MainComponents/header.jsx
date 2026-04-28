import React, { userState } from 'react';
import { MessageCircle, User, Users, Home, Search, Settings } from 'lucide-react';

function Header({ user }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{user && user.username ? user.username.slice(0, 1) : ''}</span>
                    </div>
                    <div>
                        <h1 className="text-white font-semibold">Welcome back, {user.username}</h1>
                        <p className="text-white/60 text-sm">Stay connected with your network</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                        <Search className="w-5 h-5 text-white/70" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                        <Settings className="w-5 h-5 text-white/70" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header