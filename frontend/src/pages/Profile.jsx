import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"; // Note: J'utilise le composant shadcn/ui Avatar si disponible, sinon Radix est correct.
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  User,
  GripVertical,
  FileText,
  Camera,
  Loader2, // Pour le chargement
  Edit, // Nouvelle icône pour l'édition
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Ajout de Textarea pour Bio
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État de chargement pour la soumission
  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    tel: user?.tel || "",
    bio: user?.bio || "",
    location: user?.location || "",
    file: user?.photoUrl || "", // Initialisé avec l'URL ou vide
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    if (e.target.files?.[0]) {
      setInput((prev) => ({
        ...prev,
        file: e.target.files[0], // Le fichier lui-même
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Début du chargement

    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("email", input.email);
    formData.append("tel", input.tel);
    formData.append("bio", input.bio);
    formData.append("location", input.location);

    // On n'envoie la photo que si c'est un vrai fichier (nouveau téléchargement)
    if (input.file && input.file instanceof File) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/v1/user/profile/update",
        formData,
        {
          headers: {
            // Le Content-Type est automatiquement géré par le navigateur pour FormData
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        setOpen(false); // Fermer la modale après succès
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la mise à jour.");
      console.log(error);
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  // Fonction pour obtenir les initiales pour l'AvatarFallback
  const getInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* SECTION PRINCIPALE DU PROFIL */}
        <Card className="flex md:flex-row flex-col items-center gap-10 p-6 md:p-10 shadow-xl dark:bg-gray-800">
          {/* Avatar et Infos de base */}
          <div className="flex flex-col items-center md:items-start flex-shrink-0">
            <Avatar className="h-40 w-40 rounded-full border-4 border-cyan-500 dark:border-cyan-600 shadow-md">
              <AvatarImage
                src={
                  input.file instanceof File
                    ? URL.createObjectURL(input.file)
                    : input.file || "https://github.com/shadcn.png" // Placeholder si pas d'image
                }
                alt={`${input.firstName} ${input.lastName}`}
                className="object-cover h-full w-full rounded-full"
              />
              <AvatarFallback className="flex items-center justify-center h-full w-full bg-cyan-100 text-3xl font-semibold text-cyan-700">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Détails du Profil */}
          <div className="flex flex-col gap-3 w-full">
            <CardTitle className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">
              {user?.firstName} {user?.lastName}
            </CardTitle>

            {/* Affichage de la Bio (plus grande) */}
            <CardDescription className="text-gray-700 dark:text-gray-300 italic">
              "{user?.bio || "Pas de bio renseignée."}"
            </CardDescription>

            <div className="flex flex-col gap-3 mt-4 text-sm text-gray-700 dark:text-gray-300">
              {/* Infos de contact */}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                <span>{user?.tel || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                <span>{user?.location || "Non renseignée"}</span>
              </div>

              <CardDescription className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                Membre depuis mars 2023 (à remplacer par la date réelle)
              </CardDescription>
            </div>

            <div className="mt-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default" // Utiliser la couleur primary
                    className="w-fit"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Modifier le profil
                  </Button>
                </DialogTrigger>

                {/* MODALE D'ÉDITION */}
                <DialogContent className="sm:max-w-[550px] p-6">
                  <form onSubmit={submitHandler}>
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-cyan-700 dark:text-cyan-400 text-center">
                        Modifier le profil
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Mettez à jour vos informations personnelles.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-6">
                      {/* Ligne 1: Prénom / Nom */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="firstName"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4 text-gray-500" /> Prénom
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={input.firstName}
                            onChange={changeEventHandler}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="lastName"
                            className="flex items-center gap-2"
                          >
                            <GripVertical className="h-4 w-4 text-gray-500" />{" "}
                            Nom
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={input.lastName}
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      {/* Ligne 2: Email */}
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4 text-gray-500" /> Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={input.email}
                          onChange={changeEventHandler}
                        />
                      </div>

                      {/* Ligne 3: Téléphone / Localisation */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="tel"
                            className="flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4 text-gray-500" />{" "}
                            Téléphone
                          </Label>
                          <Input
                            id="tel"
                            name="tel"
                            type="text"
                            value={input.tel}
                            onChange={changeEventHandler}
                            placeholder="Ex : +33 6..."
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="location"
                            className="flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4 text-gray-500" />{" "}
                            Localisation
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            type="text"
                            value={input.location}
                            onChange={changeEventHandler}
                            placeholder="Paris, France"
                          />
                        </div>
                      </div>

                      {/* Ligne 4: Bio */}
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="bio"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4 text-gray-500" /> Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={input.bio}
                          onChange={changeEventHandler}
                          placeholder="Décrivez-vous en quelques mots..."
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Ligne 5: Photo */}
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="file"
                          className="flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4 text-gray-500" /> Photo de
                          profil
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          name="file"
                          accept="image/*"
                          onChange={changeFileHandler}
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex justify-between pt-4">
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Annuler
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Sauvegarder"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* SECTION STATISTIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Card className="dark:bg-gray-800 shadow-md border-t-4 border-t-cyan-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-extrabold text-cyan-600">12</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                Annonces actives
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 shadow-md border-t-4 border-t-green-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-extrabold text-green-600">34</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                Annonces publiées
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 shadow-md border-t-4 border-t-yellow-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-extrabold text-yellow-600">4.8 ★</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                Note moyenne
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
