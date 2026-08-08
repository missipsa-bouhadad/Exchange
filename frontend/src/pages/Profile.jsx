import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  User,
  GripVertical,
  FileText,
  Camera,
  Loader2, 
  Edit, 
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
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    tel: user?.tel || "",
    bio: user?.bio || "",
    location: user?.location || "",
    file: user?.photoUrl || "", 
  });
  const [isLocating, setIsLocating] = useState(false);


  // pour formater la date createdAt 
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("fr-FR", options); // exp mars 2023
  };


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
        file: e.target.files[0],
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("email", input.email);
    formData.append("tel", input.tel);
    formData.append("bio", input.bio);
    formData.append("location", input.location);

    if (input.file && input.file instanceof File) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/v1/user/profile/update",
        formData,
        {
          headers: {
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        setOpen(false); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la mise à jour.");
      console.log(error);
    } finally {
      setIsLoading(false); 
    }
  };

  const getInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  // api pour detecter automatiquement la localisation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error(
        "La géolocalisation n'est pas supportée par votre navigateur."
      );
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
          );
          const detectedLocation =
            res.data.city || res.data.locality || res.data.countryName;

          setInput((prev) => ({ ...prev, location: detectedLocation }));
        } catch (err) {
          toast.error("Échec de la récupération de la localisation.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        toast.error("Veuillez autoriser l'accès à la géolocalisation.");
        setIsLocating(false);
      }
    );
  };


  return (
    <div className="pt-20 min-h-screen bg-blanc flex justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="flex md:flex-row flex-col items-center gap-10 p-6 md:p-10 shadow-xl border-t-4 border-t-mauve-fonce">
          <div className="flex flex-col items-center md:items-start flex-shrink-0">
            <Avatar className="h-40 w-40 rounded-full border-4 border-mauve-fonce shadow-md">
              <AvatarImage
                src={
                  input.file instanceof File
                    ? URL.createObjectURL(input.file)
                    : input.file || "https://github.com/shadcn.png"
                }
                alt={`${input.firstName} ${input.lastName}`}
                className="object-cover h-full w-full rounded-full"
              />
              <AvatarFallback className="flex items-center justify-center h-full w-full bg-mauve-clair text-3xl font-semibold text-mauve-fonce">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <CardTitle className="text-3xl font-bold text-mauve-fonce">
              {user?.firstName} {user?.lastName}
            </CardTitle>

            <CardDescription className="text-mauve-fonce/70 italic">
              {user?.bio || "Pas de bio renseignée."}
            </CardDescription>

            <div className="flex flex-col gap-3 mt-4 text-sm text-mauve-fonce">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-mauve-fonce" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-mauve-fonce" />
                <span>{user?.tel || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-mauve-fonce" />
                <span>{user?.location || "Non renseignée"}</span>
              </div>

              <CardDescription className="pt-2 text-xs text-mauve-fonce/70">
                Membre depuis {formatDate(user?.createdAt)}
              </CardDescription>
            </div>

            <div className="mt-6 flex justify-end w-full">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-fit">
                    <Edit className="mr-2 h-4 w-4" /> Modifier le profil
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[550px] p-6">
                  <form onSubmit={submitHandler}>
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-mauve-fonce text-center">
                        Modifier le profil
                      </DialogTitle>
                      
                      <DialogDescription className="text-center">
                        Mettez à jour vos informations personnelles.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="firstName"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4 text-mauve-fonce/70" /> Prénom
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
                            <GripVertical className="h-4 w-4 text-mauve-fonce/70" />{" "}
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

                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4 text-mauve-fonce/70" /> Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={input.email}
                          onChange={changeEventHandler}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label
                            htmlFor="tel"
                            className="flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4 text-mauve-fonce/70" /> Tel
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
                            <MapPin className="h-4 w-4 text-mauve-fonce/70" />{" "}
                            Localisation
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="location"
                              name="location"
                              type="text"
                              value={input.location}
                              onChange={changeEventHandler}
                              placeholder="Paris, France"
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
                              {isLocating ? "Détection..." : "Auto"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="bio"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4 text-mauve-fonce/70" /> Bio
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
                          <Camera className="h-4 w-4 text-mauve-fonce/70" /> Photo de
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
          <Card className="shadow-md border-t-4 border-t-mauve-fonce">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-extrabold text-mauve-fonce">12</p>
              <p className="text-sm font-medium text-mauve-fonce/70 mt-1">
                Annonces actives
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-t-4 border-t-mauve-fonce">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-extrabold text-mauve-fonce">34</p>
              <p className="text-sm font-medium text-mauve-fonce/70 mt-1">
                Annonces publiées
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-t-4 border-t-mauve-fonce">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-extrabold text-mauve-fonce">4.8 ★</p>
              <p className="text-sm font-medium text-mauve-fonce/70 mt-1">
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
