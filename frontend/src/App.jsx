import { useState,lazy,Suspense, useEffect } from "react";
import {AppProivder} from "./utilites/context";
import { injectSetAuth } from "./utilites/axios-config";

const PrivateApp = lazy(() => import("./PrivateApp"));
const PublicApp = lazy(() => import("./PublicApp"));

function App() {
  const [isAuthenticated, setAuth] = useState(localStorage.getItem('token'))

  useEffect(()=>{
    injectSetAuth(setAuth)
  },[])

  return (
    <Suspense  fallback={null}>
      {isAuthenticated ? <AppProivder>
        <PrivateApp setAuth={setAuth}/>
      </AppProivder> : <PublicApp setAuth={setAuth}/>}
    </Suspense>
  );
}

export default App;