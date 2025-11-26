import { Ad } from '../models/ad.model.js'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'

export const createAd=async(req,res)=>{
    try {
        const { title, description, type, category, user_id, status } = req.body;
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
            user_id,
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

