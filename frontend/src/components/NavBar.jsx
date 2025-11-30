import React from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Avatar } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setUser } from '../redux/authSlice'
import axios from 'axios'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const NavBar = () => {
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutHandler = async (e) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/logout",

        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(null))
        navigate("/")
      }
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <div className="py-4 fixed w-full shadow bg-cyan-950 text-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">

        {/* --- Logo + Search --- */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-10 h-10" />
            </div>
          </Link>

          <div className="relative hidden md:flex items-center w-[320px]">
            <Input
              type="text"
              placeholder="Search..."
              className="pr-10"
            />
            <Button className="absolute right-0 bg-cyan-900" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* --- Liens + Boutons utilisateur --- */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <nav>
            <ul className="flex items-center gap-6 font-medium">
              <Link to="/"><li className="hover:text-cyan-300 cursor-pointer">Home</li></Link>
              <Link to="/announcements"><li className="hover:text-cyan-300 cursor-pointer">Announcements</li></Link>
              <Link to="/about"><li className="hover:text-cyan-300 cursor-pointer">About</li></Link>
            </ul>
          </nav>

          {/* Login / Sign up */}
          {user ? (
            <div className='ml-7 flex gap-3 items-center'>
              {/* Espace pour menu utilisateur connecté */}

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/ads">Your announcements</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/demandes">Messages</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/create">Create</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler} className="text-red-600 focus:text-red-700">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="bg-white text-cyan-950 hover:bg-gray-100" onClick={logoutHandler}>Logout</Button>



            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button className="bg-white text-cyan-950 hover:bg-gray-100">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-cyan-800 hover:bg-cyan-700 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default NavBar
