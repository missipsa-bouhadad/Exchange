import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Package,
  Star,
  TrendingUp,
  Calendar,
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
  const [stats, setStats] = useState({
    activeAds: 0,
    totalAds: 0,
    avgRating: 0,
    ratingsCount: 0,
  });
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
  const fileInputRef = useRef(null);

  // Charger les stats reelles depuis l'API
  useEffect(() => {
    if (!user?._id) return;
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/user/${user._id}`,
          { withCredentials: true }
        );
        if (data.success && data.data.stats) {
          setStats(data.data.stats);
        }
      } catch (err) {
        console.error("Erreur chargement stats profil:", err);
      }
    };
    fetchStats();
  }, [user?._id]);

  // formater la date createdAt
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
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
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Echec de la mise a jour.");
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

  // detecter automatiquement la localisation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error(
        "La geolocalisation n'est pas supportee par votre navigateur."
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
          toast.error("Echec de la recuperation de la localisation.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        toast.error("Veuillez autoriser l'acces a la geolocalisation.");
        setIsLocating(false);
      }
    );
  };

  // URL de previsualisation, generee une seule fois par fichier,
  // liberee quand le fichier change ou au demontage.
  const previewUrl = useMemo(() => {
    if (input.file instanceof File) {
      return URL.createObjectURL(input.file);
    }
    return typeof input.file === "string" ? input.file : null;
  }, [input.file]);

  useEffect(() => {
    return () => {
      if (input.file instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, input.file]);

  return (
    <div className="pt-20 min-h-screen bg-blanc">
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Banniere + AVATAR */}
        <div className="relative">
          <div className="h-40 md:h-48 w-full rounded-t-2xl bg-gradient-to-br from-mauve-fonce to-mauve-clair shadow-md" />

          {/* Bouton Modifier */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="absolute top-4 right-4 shadow-md"
              >
                <Edit className="mr-2 h-4 w-4" /> Modifier le profil
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-6">
              <form onSubmit={submitHandler}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-mauve-fonce text-center">
                    Modifier le profil
                  </DialogTitle>

                  <DialogDescription className="text-center">
                    Mettez a jour vos informations personnelles.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="firstName"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-mauve-fonce/70" /> Prenom
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          {isLocating ? "Detection..." : "Auto"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-mauve-fonce/70" /> Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      placeholder="Decrivez-vous en quelques mots..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Photo */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="file" className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-mauve-fonce/70" /> Photo
                      de profil
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

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button" className="w-full sm:w-auto">
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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

          {/* Avatar */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-blanc shadow-lg">
                <AvatarImage
                  src={previewUrl || "https://github.com/shadcn.png"}
                  alt={`${input.firstName} ${input.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-semibold text-mauve-fonce">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* Bouton camera au hover*/}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-mauve-fonce/60 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Changer la photo de profil"
              >
                <Camera className="h-7 w-7 text-blanc" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={changeFileHandler}
              />
            </div>
          </div>
        </div>

        {/* Infos */}
        <Card className="mt-20 shadow-md rounded-2xl">
          <CardContent className="p-6 md:p-8 text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-mauve-fonce">
              {user?.firstName} {user?.lastName}
            </CardTitle>

            <CardDescription className="mt-2 text-mauve-fonce/70 italic">
              {user?.bio || "Pas de bio renseignee."}
            </CardDescription>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-mauve-fonce">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                {user?.email}
              </span>
              {user?.tel && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {user.tel}
                </span>
              )}
              {user?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
              )}
            </div>

            {user?.createdAt && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-mauve-fonce/60">
                <Calendar className="w-3.5 h-3.5" />
                Membre depuis {formatDate(user.createdAt)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="shadow-sm rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mauve-clair/40">
                <Package className="h-6 w-6 text-mauve-fonce" />
              </div>
              <p className="text-3xl font-extrabold text-mauve-fonce">
                {stats.activeAds}
              </p>
              <p className="text-sm font-medium text-mauve-fonce/70 mt-1">
                Annonces actives
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mauve-clair/40">
                <TrendingUp className="h-6 w-6 text-mauve-fonce" />
              </div>
              <p className="text-3xl font-extrabold text-mauve-fonce">
                {stats.totalAds}
              </p>
              <p className="text-sm font-medium text-mauve-fonce/70 mt-1">
                Annonces publiees
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mauve-clair/40">
                <Star className="h-6 w-6 text-mauve-fonce" />
              </div>
              <p className="text-3xl font-extrabold text-mauve-fonce">
                {stats.ratingsCount > 0 ? `${stats.avgRating}` : "-"}
              </p>
              <p className="text-sm font-medium text-mauve-fonce/70 mt-1">
                Note moyenne
                {stats.ratingsCount > 0 ? ` (${stats.ratingsCount})` : ""}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
