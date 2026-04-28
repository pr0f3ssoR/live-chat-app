import React, { useContext,createContext, useState } from 'react'

const AppContext = createContext();

export function AppProivder({children}) {
    const [loading,setLoading] = useState(true)
  return (
    <AppContext.Provider value={{loading,setLoading}}>
        {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext);

export const SocketContext = createContext(null)
