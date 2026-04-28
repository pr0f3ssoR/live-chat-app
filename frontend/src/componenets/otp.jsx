import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '../utilites/apicalls';
// Simple OTP Verification UI Component
const OTPVerification = () => {

  useEffect(()=>{

    const generateOTP = async () =>{
      try{
        const res = axios.post(`${baseUrl}/auth/generate-otp`,{},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
        if (res.status === 200){
          console.log('otp generate succesfully')
        }
      } catch(error){
        console.log(error.response)
      }
    }

    const checkVerification = async () =>{
      try{
        const res = await axios.get(`${baseUrl}/auth/is-verified`,{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    console.log('here in verification check')
    console.log(res)
    if(res.data.detail === 'success'){
      console.log('user verified')
      window.location.href = '/'
    }
      }catch(error){
        if(error.response.status === 403){
          await generateOTP()
        }
      }
    }

    checkVerification()
  },[])

  const [userInput,setUserInput] = useState('')

  async function handleSubmit(e){
    e.preventDefault;

    try{
      const res = await axios.post(`${baseUrl}/auth/verify-user?otp=${userInput}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.data.detail === 'success'){
        window.location.href = '/'
      }
      console.log('wrong otp code')
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Account</h1>
          <p className="text-white/70 mb-2">Enter the 6-digit code we sent to</p>
          <p className="text-emerald-300 font-semibold">your@email.com</p>
        </div>
        
        {/* Single OTP Input */}
        <div className="mb-6">
          <input
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
            type="text"
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white text-center text-2xl font-bold placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all duration-300 tracking-widest"
          />
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          <p className="text-white/70 text-sm">
            Resend code in <span className="text-emerald-300 font-semibold">60s</span>
          </p>
        </div>

        {/* Verify Button */}
        <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
          Verify & Continue
        </button>

        <div className="text-center mt-6">
          <p className="text-white/70">
            Wrong email?{' '}
            <button className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors duration-300">
              Go Back
            </button>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Security Tip</p>
              <p className="text-white/60 text-xs">Never share this code with anyone. Our team will never ask for your verification code.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default OTPVerification;