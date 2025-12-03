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
import { useDispatch } from "react-redux"
import { setUser } from "../redux/authSlice"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
        navigate("/")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
      console.log(error)
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-24">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              {/* Champ Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
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
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
          <Link to="/signup">
            <Button variant="link" className="text-sm w-full">
              Don’t have an account? Sign Up
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
