import { Ad } from '../models/ad.model.js'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'
import {User} from "../models/user.model.js";
import mongoose from "mongoose";

export const createAd=async(req,res)=>{
    try {
        let { title, description, type, city, user } = req.body;
        if (!title || !description || !type || !city || !user) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        await Ad.create({
            title,
            description,
            type,
            city,
            user,
        });

        return res.status(201).json({
            success: true,
            message: "Ad created successfully"
        });
    } catch (error) {
        console.log(error);
    }
}

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
