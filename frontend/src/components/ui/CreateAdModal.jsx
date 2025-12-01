import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import {toast} from "sonner";
import {useAdForm} from "@/hooks/useAdForm.jsx";

const CreateAdModal = () => {
    const [open, setOpen] = useState(false);

    const {
        input,
        setInput,
        citySuggestions,
        changeEventHandler,
        handleTypeChange,
        handleCityChange,
        selectCity,
        handleFileChange
    } = useAdForm({
        title: "",
        description: "",
        city: "",
        type: "GOOD",
        file: null
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", input.title);
        formData.append("description", input.description);
        formData.append("city", input.city);
        formData.append("type", input.type);
        if (input.file && input.type === 'GOOD' && input.file instanceof File) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post("http://localhost:8000/api/v1/ad/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("Votre annonce a bien été créée !");
                window.location.reload();
            }
            else {
                toast.error("Échec de la création de l'annonce.");
            }
            setOpen(false);
            setInput({ title: "", description: "", city: "", type: "GOOD", file: null });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="fixed bottom-8 right-8 z-50 bg-cyan-950 hover:bg-cyan-800 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                    title="Créer une annonce"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap group-hover:ml-2 font-bold">
                        Créer une annonce
                    </span>
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer une annonce</DialogTitle>
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
                                        key={city.code} // Code INSEE unique
                                        onClick={() => selectCity(city.nom, city.codesPostaux[0])}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                                    >
                                        {city.nom} <span className="text-gray-500">({city.codesPostaux[0]})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" className="bg-cyan-950 hover:bg-cyan-800 w-full sm:w-auto">
                            Publier l'annonce
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAdModal;