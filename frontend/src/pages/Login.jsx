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
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react" // 👁️ icônes pour montrer / cacher le mot de passe

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-24">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="flex flex-col gap-2">
              {/* Champ Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Champ Password avec icône */}
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
                    required
                    className="pr-10" // espace pour l’icône à droite
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
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
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
