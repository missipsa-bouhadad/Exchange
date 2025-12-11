import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";

import axios from "axios";
import {toast} from "sonner";
import {useAdForm} from "@/hooks/useAdForm.jsx";

const UpdateAdModal = ({ ad }) => {
    const [open, setOpen] = useState(false);
    const minDate = new Date().toISOString().split("T")[0];

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };

    const {
        input,
        citySuggestions,
        changeEventHandler,
        handleTypeChange,
        handleCityChange,
        selectCity,
        handleFileChange
    } = useAdForm({
        title: ad.title,
        description: ad.description,
        city: ad.city,
        type: ad.type,
        availabilityStart: formatDate(ad.availabilityStart),
        availabilityEnd: formatDate(ad.availabilityEnd),
        exchangeWith: ad.exchangeWith || "",
        file: null
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", input.title);
        formData.append("description", input.description);
        formData.append("city", input.city);
        formData.append("type", input.type);
        formData.append("availabilityStart", input.availabilityStart);
        formData.append("availabilityEnd", input.availabilityEnd);
        formData.append("exchangeWith", input.exchangeWith);
        if (input.file && input.type === 'GOOD' && input.file instanceof File) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post("http://localhost:8000/api/v1/ad/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            if (res.data.success) {
                window.location.reload();
                toast.success("Votre annonce a bien été créée !");
            }
            else {
                toast.error("Échec de la création de l'annonce.");
            }
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-950 hover:bg-cyan-900 text-white text-sm px-4 py-2 h-auto">
                    Modifier
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Modifier l'annonce</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="title">Titre de l'annonce</Label>
                        <Input
                            id="title"
                            name="title"
                            value={input.title}
                            onChange={changeEventHandler}
                            placeholder="Ex: Perceuse à percussion"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Type d'annonce</Label>
                        <Select onValueChange={handleTypeChange} defaultValue={input.type}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GOOD">Objet (Prêt / Don)</SelectItem>
                                <SelectItem value="SKILL">Compétence (Service)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {input.type === 'GOOD' && (
                        <div className="flex flex-col gap-1 animate-in fade-in zoom-in duration-300">
                            <Label htmlFor="file">Photo de l'objet</Label>
                            <Input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                            {input.file && (
                                <p className="text-xs text-green-600 mt-1">
                                    Fichier sélectionné : {input.file.name}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="description">Description détaillée</Label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            id="description"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            placeholder="Décrivez l'état, les conditions d'échange..."
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="exchangeWith">Ce que je souhaite en échange <span className="text-gray-400 font-normal">(Optionnel)</span></Label>
                        <Input
                            id="exchangeWith"
                            name="exchangeWith"
                            value={input.exchangeWith}
                            onChange={changeEventHandler}
                            placeholder="Ex: Un coup de main pour déménager, des légumes du jardin..."
                        />
                    </div>

                    <div className="flex flex-col gap-1 relative">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                            id="city"
                            name="city"
                            value={input.city}
                            onChange={handleCityChange}
                            placeholder="Rechercher votre ville..."
                            required
                            autoComplete="off"
                        />

                        {citySuggestions.length > 0 && (
                            <ul className="absolute z-10 top-[70px] left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {citySuggestions.map((city) => (
                                    <li
                                        key={city.code}
                                        onClick={() => selectCity(city.nom)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                                    >
                                        {city.nom} <span className="text-gray-500">({city.codesPostaux[0]})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="availabilityStart">Disponible du</Label>
                            <Input
                                id="availabilityStart"
                                name="availabilityStart"
                                type="date"
                                value={input.availabilityStart}
                                onChange={changeEventHandler}
                                className="cursor-pointer"
                                min={minDate}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="availabilityEnd">Au</Label>
                            <Input
                                id="availabilityEnd"
                                name="availabilityEnd"
                                type="date"
                                value={input.availabilityEnd}
                                onChange={changeEventHandler}
                                className="cursor-pointer"
                                min={minDate}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-cyan-950">Sauvegarder</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAdModal;