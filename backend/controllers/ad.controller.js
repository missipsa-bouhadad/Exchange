import { Ad } from '../models/ad.model.js'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'
import mongoose from "mongoose";

export const createAd=async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.id);
        const { title, description, type, city, availabilityStart, availabilityEnd, exchangeWith} = req.body;

        if (new Date(availabilityStart) > new Date(availabilityEnd)) {
            return res.status(400).json({ message: "La date de fin doit être après la date de début." });
        }
        const file = req.file;

        if (!title || !description || !type || !city) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        if (file){
            let cloudResponse;
            const fileUri = getDataUri(req.file);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
            if (cloudResponse){
                await Ad.create({
                    title,
                    description,
                    type,
                    city,
                    imageUrl: cloudResponse.secure_url,
                    user: userId,
                    availabilityStart,
                    availabilityEnd,
                    exchangeWith
                });
            }
        } else {
            await Ad.create({
                title,
                description,
                type,
                city,
                user: userId,
                availabilityStart,
                availabilityEnd,
                exchangeWith
            });
        }
        res.status(201).json({
            success: true,
            message: "Ad created successfully",
            ad: await Ad.findOne({ title, description, user: userId})
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const userId = req.user.id;
        const { title, description, city, type, availabilityStart, availabilityEnd, exchangeWith } = req.body;

        const ad = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ success: false, message: "Annonce introuvable." });
        }

        if (ad.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Vous n'êtes pas autorisé à modifier cette annonce." });
        }

        let newImageUrl = ad.imageUrl;

        if (req.file) {
            await cloudinary.uploader.destroy(ad.imageUrl);
            const cloudResponse = await cloudinary.uploader.upload(req.file.path);
            newImageUrl = cloudResponse.secure_url;
        }

        if (type === 'SKILL') {
            newImageUrl = "";
        }

        ad.title = title || ad.title;
        ad.description = description || ad.description;
        ad.city = city || ad.city;
        ad.type = type || ad.type;
        ad.availabilityStart = availabilityStart || ad.availabilityStart;
        ad.availabilityEnd = availabilityEnd || ad.availabilityEnd;
        ad.imageUrl = newImageUrl;
        ad.exchangeWith = exchangeWith || ad.exchangeWith;

        await ad.save();

        return res.status(200).json({
            success: true,
            message: "Annonce mise à jour avec succès.",
            ad
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur serveur lors de la modification." });
    }
};

export const getAllAds=async(req,res)=>{
    try {
        const ads=await Ad.find({});
        return res.status(200).json({
            success:true,
            ads
        });
    } catch (error) {
        console.log(error);
    }
}


export const getUserAds=async(req,res)=>{
    try {
        let id = new mongoose.Types.ObjectId(req.params.id);
        const userAds=await Ad.find({user:id});
        return res.status(200).json({
            success:true,
            userAds
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate('user');

        if (!ad) {
            return res.status(404).json({ message: "Annonce introuvable" });
        }

        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const getUserOfAd = async (req, res) => {
  try {
    const adId = new mongoose.Types.ObjectId(req.params.id);
    const ad = await Ad.findById(adId).populate("user", "-password");
    if (!ad) {
      return res
        .status(404)
        .json({ success: false, message: "Annonce introuvable" });
    }
    return res.status(200).json({ success: true, user: ad.user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error });
  }
};


export const removeAd = async (req, res) => {
    try {
        const userId = req.id
        const id = new mongoose.Types.ObjectId(req.params.id);

        const ad = await Ad.findById(id);

        if (!ad) {
            return res.status(404).json({ success: false, message: "Annonce introuvable" });
        }

        if (ad.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Vous n'êtes pas autorisé à supprimer cette annonce" });
        }

        await Ad.deleteOne({_id:id}).populate('user');

        res.status(200).json({ success: true, message: "Annonce supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
