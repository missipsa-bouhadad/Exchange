import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RatingStars from "@/components/ui/RatingStars";

const RatingModal = ({ open, onOpenChange, requestId, onSuccess }) => {
  const [value, setValue] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (value < 1) {
      toast.error("Veuillez sélectionner une note.");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/ratings",
        { requestId, value, comment },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Merci pour votre notation !");
        onSuccess?.(data.data);
        onOpenChange(false);
        setValue(0);
        setComment("");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'envoi de la note."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-mauve-fonce text-center">
            Noter cet échange
          </DialogTitle>
          <DialogDescription className="text-center">
            Comment s'est passé votre échange ?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-center">
            <RatingStars value={value} onChange={setValue} size="lg" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-mauve-fonce">
              Commentaire (optionnel)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              maxLength={500}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={submitting}>
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={submit}
            disabled={submitting || value < 1}
          >
            {submitting ? "Envoi..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;