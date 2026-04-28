import React, { useState } from "react";
import {
    MessageCircle, User, Users, Home, Search, Settings, Send, Phone, Video,
    MoreVertical, ArrowLeft, MapPin, Shield, Bell, HelpCircle, LogOut
} from 'lucide-react';
import Footer from "./MainComponents/footer";
import { useAppContext } from "../utilites/context";

const ProfilePage = ({ user, onNavigate, onLogout }) => {
    const {loading} = useAppContext()
    console.log(loading)
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: user?.username || '',
        email: user?.email || '',
        bio: 'Love connecting with amazing people! 🚀',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
    });

    const handleSave = () => {
        // Handle save logic here - would typically call an API
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value
        });
    };

    const stats = [
        { label: 'Messages', value: '1,234' },
        { label: 'Contacts', value: '456' },
        { label: 'Groups', value: '12' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onNavigate('/')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <h1 className="text-white font-semibold text-xl">Profile</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors duration-300 text-sm font-medium"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 pb-20">
                {/* Profile Header */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-6">
                    <div className="text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {editedUser.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900"></div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="name"
                                    value={editedUser.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-semibold text-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={editedUser.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white/70 text-center focus:outline-none focus:border-purple-500 transition-all duration-300"
                                />
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{editedUser.name}</h2>
                                <p className="text-white/70 mb-1">{editedUser.email}</p>
                                <div className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Online
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-white/60 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-white/10">
                        <h3 className="text-white font-semibold text-lg">Profile Details</h3>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-purple-400" />
                                <span className="text-white/70">Bio</span>
                            </div>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={editedUser.bio}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-4 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                                    rows="2"
                                />
                            ) : (
                                <span className="text-white text-sm flex-1 text-right">{editedUser.bio}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between py-3 border-t border-white/10">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-green-400" />
                                <span className="text-white/70">Phone</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editedUser.phone}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-4 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-all duration-300"
                                />
                            ) : (
                                <span className="text-white text-sm">{editedUser.phone}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between py-3 border-t border-white/10">
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-blue-400" />
                                <span className="text-white/70">Location</span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="location"
                                    value={editedUser.location}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-4 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-all duration-300"
                                />
                            ) : (
                                <span className="text-white text-sm">{editedUser.location}</span>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="px-6 pb-6">
                            <button
                                onClick={handleSave}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Settings & Actions */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-white/10">
                        <h3 className="text-white font-semibold text-lg">Settings & Privacy</h3>
                    </div>

                    <div className="divide-y divide-white/10">
                        <button className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors duration-300 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Settings className="w-5 h-5 text-gray-400" />
                                <span className="text-white">Account Settings</span>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-white/50 transform rotate-180" />
                        </button>

                        <button className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors duration-300 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <span className="text-white">Privacy & Security</span>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-white/50 transform rotate-180" />
                        </button>

                        <button className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors duration-300 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Bell className="w-5 h-5 text-yellow-400" />
                                <span className="text-white">Notifications</span>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-white/50 transform rotate-180" />
                        </button>

                        <button className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors duration-300 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <HelpCircle className="w-5 h-5 text-cyan-400" />
                                <span className="text-white">Help & Support</span>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-white/50 transform rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                    <button
                        onClick={onLogout}
                        className="w-full px-6 py-4 text-left hover:bg-red-500/10 transition-colors duration-300 flex items-center space-x-3 group"
                    >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                        <span className="text-red-400 group-hover:text-red-300 font-medium transition-colors duration-300">Logout</span>
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <Footer onNavigate={onNavigate}/>
        </div>
    );
};

export default ProfilePage