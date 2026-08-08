import { Ad } from '../models/ad.model.js'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'
import { getPublicIdFromUrl } from '../utils/cloudinaryHelper.js'
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
                message: "All fields are required"
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating ad"
        });
    }
}

export const updateAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const userId = req.user.id;
        const { title, description, city, type, availabilityStart, availabilityEnd, exchangeWith } = req.body;

        const ad = await Ad.findById(adId);
        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found." });
        }

        if (ad.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not allowed to update this ad." });
        }

        let newImageUrl = ad.imageUrl;

        if (req.file) {
            const oldPublicId = getPublicIdFromUrl(ad.imageUrl);
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }
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
            message: "Ad updated successfully.",
            ad
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error while updating ad." });
    }
};

export const getAllAds=async(req,res)=>{
    try {
        const ads=await Ad.find({}).populate('user');
        return res.status(200).json({
            success:true,
            ads
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching ads"
        });
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching user ads"
        });
    }
}

export const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate('user');

        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const removeAd = async (req, res) => {
    try {
        const userId = req.id
        const id = new mongoose.Types.ObjectId(req.params.id);

        const ad = await Ad.findById(id);

        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }

        if (ad.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not allowed to delete this ad" });
        }

        await Ad.deleteOne({_id:id}).populate('user');

        res.status(200).json({ success: true, message: "Ad deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
