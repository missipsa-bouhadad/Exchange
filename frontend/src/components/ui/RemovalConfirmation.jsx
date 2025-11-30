import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import {useSelector} from "react-redux";
import axios from "axios";
import {toast} from "sonner";

const RemovalConfirmation = ({ad, onDeleteSuccess}) => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth)

    function cancelRemoval() {
        setOpen(false);
    }

    async function handleRemoval() {
        try {
            const res = await axios.delete("http://localhost:8000/api/v1/ad/delete/" + ad._id, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setOpen(false);
                if (onDeleteSuccess) {
                    onDeleteSuccess(ad._id);
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Impossible de supprimer l'annonce.");
            console.log(error);
        }
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-900 hover:bg-red-800 text-white text-sm px-4 py-2 h-auto">
                    Supprimer
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Supprimer l'annonce</DialogTitle>
                </DialogHeader>
                    <div>
                        <p className="mb-4">Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={cancelRemoval} className="bg-red-900 hover:bg-red-800 text-white text-sm px-4 py-2 h-auto">Annuler</Button>
                        <Button onClick={handleRemoval} className="bg-cyan-950 hover:bg-cyan-800 text-white text-sm px-4 py-2 h-auto">Confirmer</Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RemovalConfirmation;