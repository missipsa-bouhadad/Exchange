import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  MapPin,
  FileText,
  GripVertical,
  Loader2, // Nouvelle icône pour le chargement
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Nouvel état pour la confirmation
  const [isLoading, setIsLoading] = useState(false); // État de chargement pour la soumission
  const [isLocating, setIsLocating] = useState(false); // État de chargement pour la localisation
  const [passwordError, setPasswordError] = useState(""); // État d'erreur pour les mots de passe

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // Nouveau champ
    bio: "",
    location: "",
  });

  // --- Gestion de la détection de localisation ---
  const detectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error(
        "La géolocalisation n'est pas supportée par votre navigateur."
      );
    }

    setIsLocating(true); // Début du chargement de la localisation

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr` // Langue FR
          );

          const detectedLocation =
            res.data.city || res.data.locality || res.data.countryName;

          setUser((prev) => ({ ...prev, location: detectedLocation }));
          toast.success(`Location détectée : ${detectedLocation}`);
        } catch (err) {
          toast.error("Échec de la récupération de la localisation.");
        } finally {
          setIsLocating(false); // Fin du chargement
        }
      },
      () => {
        // En cas d'erreur ou de refus de permission
        toast.error("Veuillez autoriser l'accès à la géolocalisation.");
        setIsLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Réinitialiser l'erreur de mot de passe lors de la saisie
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // --- Validation côté client et soumission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation de la confirmation du mot de passe
    if (user.password !== user.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      toast.error("Veuillez vérifier votre mot de passe.");
      return;
    }

    // Vous pouvez ajouter ici d'autres validations (longueur, format email)

    setIsLoading(true); // Début du chargement
    setPasswordError(""); // Réinitialiser l'erreur si la validation locale est OK

    try {
      // Retirer le champ 'confirmPassword' avant d'envoyer au serveur
      const { confirmPassword, ...dataToSend } = user;

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        dataToSend, // Utiliser dataToSend sans confirmPassword
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      // Afficher l'erreur renvoyée par le serveur ou un message générique
      toast.error(error.response?.data?.message || "Échec de l'inscription.");
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
      <Card className="w-full max-w-lg shadow-xl p-6 transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">
            Create an account
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join our community in just a few steps.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  First name
                </Label>
                <Input
                  name="firstName"
                  id="firstName"
                  placeholder="John"
                  onChange={handleChange}
                  value={user.firstName}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-500" />
                  Last name
                </Label>
                <Input
                  name="lastName"
                  id="lastName"
                  placeholder="Doe"
                  onChange={handleChange}
                  value={user.lastName}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" /> Email
              </Label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" /> Password
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    value={user.password}
                    required
                    className={`pr-10 ${passwordError ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4 text-gray-500" /> Confirm password
                </Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={handleChange}
                    value={user.confirmPassword}
                    required
                    className={`pr-10 ${passwordError ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>
            </div>

         
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" /> Bio (optional)
              </Label>
              <Textarea
                name="bio"
                id="bio"
                placeholder="Tell us something about yourself..."
                onChange={handleChange}
                value={user.bio}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" /> Location
              </Label>
              <div className="flex gap-2">
                <Input
                  name="location"
                  id="location"
                  placeholder="City (e.g., Paris)"
                  onChange={handleChange}
                  value={user.location}
                  required
                  className="flex-grow"
                />
                <Button
                  type="button"
                  onClick={detectLocation}
                  disabled={isLocating}
                  variant="secondary"
                  className="flex-shrink-0"
                >
                  {isLocating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="mr-2 h-4 w-4" />
                  )}
                  {isLocating ? "Détection..." : "Auto detection"}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 text-base mt-4"
              disabled={isLoading || !!passwordError}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4">
          <Link to="/login" className="w-full text-center">
            <Button
              variant="link"
              className="text-sm w-full text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Do you already have an account? Log in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
