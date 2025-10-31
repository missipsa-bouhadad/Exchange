import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import Announcements from './pages/Announcements'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import About from './pages/About'
import NavBar from './components/NavBar'
import { CustomToaster } from "./components/ui/sonner"
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Posts from './pages/Posts'
import Demandes from './pages/Demandes'
import Create from './pages/Create'

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
  {
    path:'/dashboard',
    element:<><NavBar/><Dashboard/></>,
    children:[
      {
        path:"profile",
        element:<><Profile/></>
      },
      {
        path:"posts",
        element:<><Posts/></>
      },
      {
        path:"demandes",
        element:<><Demandes/></>
      },
      {
        path:"create",
        element:<><Create/></>
      }
  ]
  }
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