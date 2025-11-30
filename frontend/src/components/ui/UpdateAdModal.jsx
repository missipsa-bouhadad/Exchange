import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

const UpdateAdModal = ({ ad }) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState({
        title: ad.title,
        description: ad.description,
        location: ad.location || "",
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        // Ta logique d'update vers le backend ici
        console.log("Mise à jour de l'annonce :", input);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Le bouton qui déclenche l'ouverture */}
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
                        <Label htmlFor="title">Titre</Label>
                        <Input id="title" name="title" value={input.title} onChange={changeEventHandler} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="description">Description</Label>
                        {/* Utilise un Textarea pour la description, c'est mieux */}
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            id="description" name="description" value={input.description} onChange={changeEventHandler}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="location">Localisation</Label>
                        <Input id="location" name="location" value={input.location} onChange={changeEventHandler} />
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