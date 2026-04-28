import React from "react"
import { useLocation } from "react-router-dom";
import { Home, Users, MessageCircle, User } from "lucide-react";

function Footer({ onNavigate }) {
  const location = useLocation()
  const isActive = (path) => {
    return location.pathname === path ? 'text-purple-400' : 'text-white/60 hover:text-white transition-colors duration-300'
  }
  return (
    <div className="mt-auto sticky bottom-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-t border-white/10">
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => onNavigate('/')}
          className={`flex flex-col items-center p-3 ${isActive('/')}`}>
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => onNavigate('/users')}
          className={`flex flex-col items-center p-3 ${isActive('/users')}`}
        >
          <Users className="w-6 h-6 mb-1" />
          <span className="text-xs">Users</span>
        </button>
        <button
          onClick={() => onNavigate('/chats')}
          className={`flex flex-col items-center p-3 ${isActive('/chats')}`}>
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs">Chats</span>
        </button>
        <button 
          onClick={()=> onNavigate('/profile')}
          className="flex flex-col items-center p-3 text-white/60 hover:text-white transition-colors duration-300">
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  )
}


export default Footer