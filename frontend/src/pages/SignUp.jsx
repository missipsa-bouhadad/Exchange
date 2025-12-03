import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate=useNavigate()
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    // e.target = l'élément HTML qui a déclenché l'événement
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev, // copie de l'état précédent
      [name]: value, // met à jour uniquement le champ modifié
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // empêche le rechargement de la page
    //console.log("Données utilisateur :", user)
    try {
      const res=await axios.post("http://localhost:8000/api/v1/user/register",user,{
         headers:{
            "Content-Type":"application/json"
         },
         withCredentials:true
      })
      if(res.data.success){
        navigate('/login')
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign in failed")
      console.log(error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-24">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="John"
                  onChange={handleChange}
                  value={user.firstName}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  onChange={handleChange}
                  value={user.lastName}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  onChange={handleChange}
                  value={user.email}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    value={user.password}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full bg-cyan-950">
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            Sign Up with Google
          </Button>
          <Link to="/login">
            <Button variant="link" className="text-sm w-full">
              Already have an account? Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp
