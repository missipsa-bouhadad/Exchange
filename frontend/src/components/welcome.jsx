import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cyan-950">
      {/* Titre */}
      <h1 className="text-3xl md:text-8xl font-bold text-white mb-8">
        Welcome
      </h1>

      {/* Boutons */}
      <div className="flex flex-row gap-4">
        <Link to="/">
          <Button className="bg-white text-cyan-950 hover:bg-gray-100">
            Learn More
          </Button>
        </Link>
        <Link to="/">
          <Button className="bg-white text-cyan-950 hover:bg-gray-100">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Welcome
