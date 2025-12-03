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
import { Mail, MapPin, Phone } from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import store from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const [open,setOpen]=useState(false)
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    tel: user?.tel || "",
    facebook: user?.facebook || "",
    adresse: user?.adresse || "",
    file: user?.photoUrl || "",
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
        file: e.target.files[0],
      }));
    }
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("firstName", input.firstName);
  formData.append("lastName", input.lastName);
  formData.append("email", input.email);
  formData.append("tel", input.tel);
  formData.append("facebook", input.facebook);
  formData.append("adresse", input.adresse);

  // On n'envoie la photo que si c'est un vrai fichier
  if (input.file && input.file instanceof File) {
    formData.append("file", input.file);
  }

  try {
    const res = await axios.put(
      "http://localhost:8000/api/v1/user/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      dispatch(setUser(res.data.user));
      setOpen(false)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
    console.log(error);
  }
};


  return (
    <div className="pt-20 md:h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto mt-4">
        <Card className="flex md:flex-row flex-col items-center gap-10 p-6 md:p-10 mx-4 md:mx-0 dark:bg-gray-800">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-40 w-40 rounded-full border-2 border-gray-300 dark:border-gray-700">
              <AvatarImage
                src={
                  input.file instanceof File
                    ? URL.createObjectURL(input.file)
                    : input.file || "https://github.com/shadcn.png"
                }
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {input.firstName} {input.lastName}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Membre depuis mars 2023
            </CardDescription>

            <div className="flex flex-col gap-2 mt-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{input.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>{input.tel || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{input.adresse || "Non renseignée"}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={()=>setOpen(true)} className="bg-cyan-950 hover:bg-cyan-900 w-fit">
                    Modifier le profil
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={submitHandler}>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Modifier le profil
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Mettez à jour vos informations personnelles.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={input.firstName}
                            onChange={changeEventHandler}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={input.lastName}
                            onChange={changeEventHandler}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={input.email}
                          onChange={changeEventHandler}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="tel">Téléphone</Label>
                          <Input
                            id="tel"
                            type="text"
                            name="tel"
                            value={input.tel}
                            onChange={changeEventHandler}
                            placeholder="Ex : +33 6 45 78 90 12"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            type="text"
                            name="facebook"
                            value={input.facebook}
                            onChange={changeEventHandler}
                            placeholder="www.facebook.com/Johe"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input
                          id="adresse"
                          type="text"
                          name="adresse"
                          value={input.adresse}
                          onChange={changeEventHandler}
                          placeholder="34 rue, Ronsard, Pau"
                        />
                      </div>

                      <div>
                        <Label>Picture</Label>
                        <Input
                          id="file"
                          type="file"
                          name="file"
                          accept="image/*"
                          className="w-[277px]"
                          onChange={changeFileHandler}
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-cyan-950 hover:bg-cyan-900"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mx-4 md:mx-0">
          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-gray-600 dark:text-gray-400">Annonces actives</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-green-600">34</p>
              <p className="text-gray-600 dark:text-gray-400">Annonces publiées</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">4.8 ★</p>
              <p className="text-gray-600 dark:text-gray-400">Note moyenne</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
