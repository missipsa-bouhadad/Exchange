import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const NavBar = () => {
  const user = false;

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
            <div>
              {/* Espace pour menu utilisateur connecté */}
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
