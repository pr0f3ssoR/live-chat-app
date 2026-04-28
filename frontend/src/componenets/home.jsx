import React, { useEffect, userState } from 'react';
import { MessageCircle, User, Users, Home, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './MainComponents/footer';
import Header from './MainComponents/header';

import axios from 'axios';
import { useAppContext } from '../utilites/context';
import Chat from './chat';

// Home Component
const HomePage = ({ user, onNavigate,recentChats }) => {

  // const recentChatsDemo = [
  //   { id: 1, name: 'Alice Johnson', lastMessage: 'Hey! How are you doing?', time: '2m ago', unread: 3, avatar: '👩‍💼' },
  //   { id: 2, name: 'Bob Smith', lastMessage: 'See you tomorrow!', time: '1h ago', unread: 0, avatar: '👨‍💻', sent: true },
  //   { id: 3, name: 'Team Chat', lastMessage: 'Meeting at 3 PM', time: '3h ago', unread: 5, avatar: '👥' },
  //   { id: 4, name: 'Sarah Wilson', lastMessage: 'Thanks for your help!', time: '1d ago', unread: 0, avatar: '👩‍🎨' }
  // ];

  const avatar =  '👩‍💼'

  const {loading} = useAppContext()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      {/* Header */}
      <Header user={user} />
      {/* Quick Actions */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('/users')}
            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 text-left hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 group"
          >
            <Users className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-white font-semibold">Find Users</h3>
            <p className="text-white/60 text-sm">Connect with new people</p>
          </button>

          <button className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-4 text-left hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 group">
            <MessageCircle className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-white font-semibold">New Chat</h3>
            <p className="text-white/60 text-sm">Start a conversation</p>
          </button>
        </div>

        {/* Recent Chats */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-semibold text-lg">Recent Conversations</h2>
          </div>
          <div className="divide-y divide-white/10">
            {recentChats.map((chat,index) => (
              <Chat chat={chat} avatar={avatar} key={index}/>
            ))}
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>

  );
};


export default HomePage