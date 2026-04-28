import React, { useState } from 'react';
import { MessageCircle, User, Users, Home, Search, Settings, Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {Login} from '../utilites/apicalls';
import Loader from '../utilites/animation';
import {InvalidAlert} from '../utilites/alerts';


// Login Component
const LoginPage = ({ onLogin, switchToRegister, setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(false)

  const handleSubmit = async (e) => {
    // Handle login logic here
    setAlert(false)
    setLoading(true)
    e.preventDefault();
    const token = await Login(email, password); // Returns token if auth successfull
    if (token) {localStorage
      .setItem('token', token)
      // navigate('/')
      setAuth(token)
    }
    else {
      setAlert(true)
      setLoading(false)
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to continue your conversations</p>
        </div>
        {alert ? <InvalidAlert text={'Invalid Credentials!'}/> : ''}
        <div className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {loading ? <Loader /> : 'Log in'}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link to={'/register'}
              onClick={switchToRegister}
              className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default LoginPage