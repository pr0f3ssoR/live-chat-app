import React, { useEffect, useState } from 'react';
import { MessageCircle, User, Users, Home, Search, Settings, Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import Footer from './MainComponents/footer';
import Header from './MainComponents/header';
import axios from '../utilites/axios-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


// Users Component
const UsersPage = ({ onNavigate,user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [queryUsers,setQueryUsers] = useState([]);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();


  useEffect(()=>{
    if (!searchTerm.trim()) {
            setQueryUsers([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/users/?query=${searchTerm}`,{
                  headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                  }
                })
                // setResults(data.users);
                console.log(res.data)
                setQueryUsers(res.data)
            }
            catch(error){
              console.log(error)
            }
            
            finally {
                setLoading(false);
            }
        }, 300); // wait 300ms after user stops typing

        // cleanup — cancel previous timer if user typed again
        return () => clearTimeout(timer);
  },[searchTerm])

  const createConversation = async (userId)=>{
    try{
      const res = await axios.post(`/api/create-conversation/${userId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      
      })
      const convId = res.data.conversation_id
      navigate(`/conversations/${convId}`)
    } catch(error){
      console.log(error)
    }
  }

  const avatar= '👩‍🎓'

  const users = [
    { id: 1, name: 'Emma Watson', status: 'online', lastSeen: 'Active now', avatar: '👩‍🎓', bio: 'Software Engineer at TechCorp' },
    { id: 2, name: 'Michael Chen', status: 'away', lastSeen: '5 minutes ago', avatar: '👨‍💼', bio: 'Product Manager' },
    { id: 3, name: 'Sarah Johnson', status: 'online', lastSeen: 'Active now', avatar: '👩‍🎨', bio: 'UI/UX Designer' },
    { id: 4, name: 'David Wilson', status: 'offline', lastSeen: '2 hours ago', avatar: '👨‍🚀', bio: 'Data Scientist' },
    { id: 5, name: 'Lisa Anderson', status: 'online', lastSeen: 'Active now', avatar: '👩‍💻', bio: 'Full Stack Developer' },
    { id: 6, name: 'James Miller', status: 'away', lastSeen: '1 hour ago', avatar: '👨‍🎯', bio: 'Marketing Specialist' }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      {/* Header */}
      <Header user={user}/>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="px-6 pb-20">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-white font-semibold">
              {queryUsers.length} {queryUsers.length === 1 ? 'User' : 'Users'} Found
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {queryUsers.map((user) => (
                <div
                  onClick={()=>createConversation(user.id)}
                  key={user.id}
                  className="px-6 py-4 hover:bg-white/5 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="text-3xl">{avatar}</div>
                        {/* <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`}></div> */}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors duration-300">
                          {user.name}
                        </h3>
                        <p className="text-white/60 text-sm">{user.username}</p>
                        {/* <p className="text-white/40 text-xs mt-1">{user.lastSeen}</p> */}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={e=>e.stopPropagation()} className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-colors duration-300">
                        <MessageCircle className="w-4 h-4 text-purple-400" />
                      </button>
                      <button onClick={e=>e.stopPropagation()} className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-full transition-colors duration-300">
                        <Phone className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button onClick={e=>e.stopPropagation()} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-full transition-colors duration-300">
                        <Video className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default UsersPage