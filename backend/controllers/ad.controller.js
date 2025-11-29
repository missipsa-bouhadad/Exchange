import { Ad } from '../models/ad.model.js'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'
import {User} from "../models/user.model.js";

export const createAd=async(req,res)=>{
    try {
        let { title, description, type, category, user_id, status } = req.body;
        if (!title || !description || !type || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        await Ad.create({
            title,
            description,
            type,
            category,
            user: user_id,
            status
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
        const userAds=await Ad.find({user:req.id});
        return res.status(200).json({
            success:true,
            ads
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
