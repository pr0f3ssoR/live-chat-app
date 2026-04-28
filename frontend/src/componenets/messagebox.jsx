import React, { useState, useRef, useEffect, useContext } from "react";
import {
    Search, Send, Phone, Video,
    MoreVertical, ArrowLeft,Delete,
} from 'lucide-react';
import axios from "../utilites/axios-config";
import { data, useLocation, useParams } from "react-router-dom";
import { SocketContext } from "../utilites/context";

const MessageBox = ({ onNavigate, selectedUser }) => {
    const [socket, setSocket_] = useState(null)
    const { s, loadingSocket } = useContext(SocketContext);
    const { id } = useParams()
    const ref = useRef(null)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    const [tempConvId, setTempConvId] = useState('')
    const containerRef = useRef(null);
    const [pageCursor, setPageCursor] = useState('')
    const [name,setName] = useState('')
    const [error,setError] = useState(true)
    const isLoadingMore = useRef(false);
    const prevScrollHeight = useRef(0);

    useEffect(()=>{
        const fetchDisplayName = async () =>{
            try{
                const res = await axios.get(`/api/conv-user/${id}`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
                const displayName = res.data.username
                setName(displayName)
                setError(false)
            } catch (error){
                console.log(error.response)
            }
        }

        fetchDisplayName()
    },[])

    useEffect(() => {
        if (error) return
        const fetchMessages = async () => {
            try {
                const URL = `/api/conversations/${id}?cursor=${pageCursor}`
                const res = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setMessages(res.data.messages.reverse())
                setPageCursor(res.data.page_cursor)
            }

            catch (error) {
                console.log(error.message)
            }
        }
        fetchMessages()
    }, [error])


    useEffect(() => {
    if (error) return;

    const handleScroll = async () => {
        if (error) return
        if (ref.current.scrollTop === 0 && pageCursor !== null) {
            isLoadingMore.current = true;
            prevScrollHeight.current = ref.current.scrollHeight;
            try {
                const URL = `/api/conversations/${id}?cursor=${pageCursor}`;
                const res = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessages(prev => [...res.data.messages.reverse(), ...prev]);
                setPageCursor(res.data.page_cursor);
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    const el = ref.current;
    el.addEventListener("scroll", handleScroll);

    return () => {
        el.removeEventListener("scroll", handleScroll);
    };
}, [pageCursor, error]);


    useEffect(()=>{
        console.log('got new page cursor')
        console.log(pageCursor)
    },[pageCursor])


    const displayMessage = (message) => {
        if (error) return
        setMessages(prevMessages => [...prevMessages, message]);
        if (message.sender && message.sender === 'me') setMessage('');

    };
    useEffect(() => {
    const box = ref.current;
    if (box && messages.length > 0) {
        if (isLoadingMore.current) {
            box.scrollTop = box.scrollHeight - prevScrollHeight.current; 
            isLoadingMore.current = false;
            return;
        }
        box.scrollTop = box.scrollHeight;
    }
}, [messages, error]);


    function sendMessage(){
        socket.emit('send_message', { temp_conv_id: tempConvId, message: message },(data)=>{
                if (data.code === 'fail') socket.emit('create_conv_session',{conv_id:id},(data)=>{
                    if (data?.code === 'success') {
                    setTempConvId(data.temp_conv_id)}
                    socket.emit('send_message',{temp_conv_id:data.temp_conv_id,message:message})
                })
            })
    }

    const handleKeyPress = (e) => {
        if (error) return
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage()
        }
    };


    useEffect(() => {
        if (error) return
        if (!socket) return
        socket.emit('create_conv_session', { conv_id: id }, (data) => {
            if (data?.code === 'success') {
                setTempConvId(data.temp_conv_id)
            }
        })
    }, [socket,error])

    useEffect(() => {
        if (error) return
        if (!socket) return;
        socket.on('broadcast_message', (data) => {
            if (Number(data.chat_user_id) === Number(id)) {
                displayMessage(data.message)
            };
        })
        socket.on(`conv_message_${id}`, (data) => {
            const messageObj = {

                message: data.message,
                sender: Number(data.sender_id) === Number(selectedUser.id) ? 'me' : 'other',
                sentViaSocket:true
                // status: Number(data.sender_id) === Number(selectedUser.id) ? 'sent' : 'unread',
            }
            displayMessage(messageObj)
        })
        return () => {
            socket.off('broadcast_message')
            socket.off(`conv_message_${id}`)
        }
    }, [socket,error])

    useEffect(() => {
        setSocket_(s);
    }, [loadingSocket,]);


    const deleteConversation = async () =>{
        try{
            const res = await axios.post(`/api/delete-conv/${id}`,{},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
            if (res.status === 200){
                window.location.href = '/'
            }
        }catch(error){
            console.log(error)
        }
    }


    return (

        <div style={{ height: "100vh", overflowY: "auto" }} ref={containerRef} className="h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex flex-col">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onNavigate('/')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">{selectedUser?.avatar || "👩‍💼"}</div>
                            <div>
                                <h1 className="text-white font-semibold">{name || "Alice Johnson"}</h1>
                                <p className="text-green-400 text-sm">Active now</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                            <Delete onClick={deleteConversation} className="w-5 h-5 text-white/70" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                            <Video className="w-5 h-5 text-white/70" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                            <MoreVertical className="w-5 h-5 text-white/70" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={ref} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((msg, id) => (
                    <div
                        key={id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {msg.sender === 'other' && (
                                <div className="text-lg mb-1">{msg.avatar}</div>
                            )}
                            <div className="group">
                                <div
                                    className={`px-4 py-3 rounded-2xl ${msg.sender === 'me'
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                        : 'bg-white/10 text-white border border-white/20'
                                        } shadow-lg backdrop-blur-sm`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                </div>
                                {/* <p className={`text-xs text-white/50 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                    {msg.status}
                                </p> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 px-6 py-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none overflow-hidden"
                            rows="1"
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                            <Search className="w-4 h-4 text-white/50" />
                        </button>
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={message.trim() === ''}
                        className={`p-3 rounded-full transition-all duration-300 ${message.trim() === ''
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 shadow-lg'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* Typing Indicator */}
                <div className="flex items-center space-x-2 mt-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-white/50 text-xs">Someone is typing...</span>
                </div>
            </div>
        </div>
    );
};

export default MessageBox