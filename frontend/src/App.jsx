import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
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
import Requests from "./pages/Requests";
import AdDetail from "@/pages/AdDetail.jsx";
import UserAnnouncements from "@/pages/UserAnnouncements.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/announcements" replace />,
  },

  {
    path: "/announcements",
    element: (
      <>
        <NavBar />
        <Announcements />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <NavBar />
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <NavBar />
        <SignUp />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <NavBar />
        <About />
      </>
    ),
  },
  {
    path: "/ad/:id",
    element: (
      <>
        <NavBar />
        <AdDetail />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <NavBar />
        <Dashboard />
      </>
    ),
    children: [
      {
        path: "profile",
        element: (
          <>
            <Profile />
          </>
        ),
      },
      {
        path: "ads",
        element: (
          <>
            <UserAnnouncements />
          </>
        ),
      },
      {
        path: "posts",
        element: (
          <>
            <Posts />
          </>
        ),
      },
      {
        path: "demandes",
        element: (
          <>
            <Demandes />
          </>
        ),
      },
      {
        path: "requests",
        element: (
          <>
            <Requests />
          </>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
      <CustomToaster position="top-center" richColors /> 
    </>
  )
}

export default App