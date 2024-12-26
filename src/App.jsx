import { createContext, useState } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom'
// import Home from '../../Olx/src/pages/Home/Home'
import Home from './pages/Home/Home'
import Sell from '../src/pages/Sell/Sell'
import Show_item from './pages/Show_item/Show_item'
import { getAuth } from 'firebase/auth'


const  AuthContext = createContext()

function App() {

  const auth = getAuth();
  const user = auth.currentUser;
  // console.log(user.displayName);

  
  const [LoginStatus , setLoginStatus ] = useState(false);
  const [Hello , setHello] = useState("hellow");
  const login = () => setLoginStatus(true);
  const logout = () => setLoginStatus(false);

  return (
    <>
    
    <AuthContext.Provider value={{LoginStatus, login, logout, Hello , setHello}}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sell' element={<Sell />} ></Route>
        <Route path='/item/:id' element={<Show_item />} ></Route>
      </Routes>      
    </AuthContext.Provider>

    </>
  )
}



export default App
export {
  AuthContext
} 
