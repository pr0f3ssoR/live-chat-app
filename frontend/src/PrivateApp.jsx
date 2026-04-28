import React, { createContext, use, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import HomePage from './componenets/home'
import UsersPage from './componenets/users'
import ChatsPage from './componenets/chats'
import ProfilePage from './componenets/profile'
import MessageBox from './componenets/messagebox'
import axios from './utilites/axios-config'
import { useAppContext } from './utilites/context'
import { io, Socket } from 'socket.io-client'
import { SocketContext } from './utilites/context'
import { CopyMinus } from 'lucide-react'
import OTPVerification from './componenets/otp'
import { getConvUser } from './utilites/apicalls'
import Cookies from "js-cookie";
import { baseUrl } from './utilites/apicalls'


function PrivateApp({ setAuth }) {
  const { setLoading } = useAppContext()

  const [loadingSocket, setLoadingSocket] = useState(true)
  const handleLogout = async () => {
    try{
      const res = await axios.post('/auth/logout',{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}},{
      withCredentials:true
    })
    }
    catch(error){
      console.log(error)
    }
    localStorage.removeItem('token');
    setAuth(null)
    Cookies.remove('refresh_token',{path:'/auth'})
    navigate('/')
  }

  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState({});
  const [chats, setChats] = useState([]);



  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/u", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if(res.status === 200){
          setUser(res.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect( () => {
    const fetchChats = async () =>{
      try{
        const res = await axios.get('/api/conversations',{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setChats(res.data)
      }
      catch(error){
        console.log(error.message)
      }
    }

    fetchChats()

  }, [])

  useEffect(() => {
    const socket = io(`${baseUrl}/chat`, {
      auth:{
        token:localStorage.getItem('token')
      }

    }
    )
    setSocket(socket)
    setLoadingSocket(false)
    socket.on('connect', () => {
      console.log(`Connected: ${socket.id}`)
    })
    socket.on('message_handler', (data) => {
      console.log(data)
    })
    socket.on('disconnect', (reason) => {
      console.log(reason)
    })
    socket.on('general',(data)=>{
      console.log(data)
    })
  }, [])

  useEffect(() => {
  if (!socket) return;

  socket.on('chat_message', async (message) => {
    console.log('new message', message);

    setChats((prevChats) => {
      const oldChat = prevChats.find(c => Number(c.conv_id) === Number(message.conv_id));
      if (!oldChat) return prevChats; // new conv, handled below
      const otherChats = prevChats.filter(c => Number(c.conv_id) !== Number(message.conv_id));
      return [{ ...oldChat, last_message: message.message }, ...otherChats];
    });

    // check OUTSIDE setState, not inside it
    const isNewConv = !chats.some(c => Number(c.conv_id) === Number(message.conv_id));
    if (isNewConv) {
      try {
        const convUser = await getConvUser(message.conv_id);
        const newChat = { conv_id: message.conv_id, user_id: convUser.id, username: convUser.username, last_message: message.message };
        console.log('new chat is:', newChat);
        setChats(prev => [newChat, ...prev]);
      } catch (error) {
        console.log(error.message);
      }
    }
  });

  return () => socket.off('chat_message');
}, [socket, chats]); // add chats to dependency array




  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path='/' element={<HomePage user={user} recentChats={chats} onNavigate={(page) => navigate(page)} />} />
      <Route path='/users' element={<UsersPage onNavigate={(page) => navigate(page)} user={user} />} />
      <Route path='/chats' element={<ChatsPage onNavigate={(page) => navigate(page)} user={user} />} />
      <Route path='/profile' element={<ProfilePage user={user} onLogout={handleLogout} onNavigate={(page) => navigate(page)} />} />
      <Route path='/otp' element={<OTPVerification/>}/>
      <Route path='/conversations/:id' element={
        <SocketContext.Provider value={{ s: socket, loadingSocket, setChats }}>
          <MessageBox selectedUser={user} onNavigate={page => navigate(page)} />
        </SocketContext.Provider>
      } />
    </Routes>
  )
}

export default PrivateApp