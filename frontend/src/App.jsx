import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import Announcements from './pages/Announcements'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import About from './pages/About'
import NavBar from './components/NavBar'
import { CustomToaster } from "./components/ui/sonner"

const router=createBrowserRouter([
  {
    path:'/',
    element:<><NavBar/><Home/></>
  },
  {
    path:'/announcements',
    element:<><NavBar/><Announcements/></>
  },
  {
    path:'/login',
    element:<><NavBar/><Login/></>
  },
  {
    path:'/signup',
    element:<><NavBar/><SignUp/></>
  },
  {
    path:'/about',
    element:<><NavBar/><About/></>
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
      <CustomToaster position="top-center" richColors /> 
    </>
  )
}

export default App