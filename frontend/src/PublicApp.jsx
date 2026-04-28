import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import LoginPage from './componenets/login'
import RegisterPage from './componenets/register'
import OTPVerification from './componenets/otp'

function PublicApp({ setAuth }) {
    const privateRoutes = ['/users', '/chats', '/profile']
    return (
        <Routes>
            <Route path='/' element={<LoginPage setAuth={setAuth} />} />
            <Route path='/register' element={<RegisterPage setAuth={setAuth} />} />
            {privateRoutes.map((item, key) => {
                return <Route key={key} path={item} element={<Navigate to='/' />} />
            })}
        </Routes>

    )
}

export default PublicApp