import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password ,bio,location} = req.body
        if (!email || !firstName || !lastName || !password || !bio) {
            return res.status(400).json({
                success: false,
                message: "all fiels are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "invalid email"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 6 characters"
            })
        }

        const existingUserByEmail = await User.findOne({ email: email })
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "email already used"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({
            firstName, lastName, email, password: hashPassword,bio,location
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully "
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "failed to register"
        })

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const userByEmail = await User.findOne({ email: email })
        if (!userByEmail) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const isPassewordValid=await bcrypt.compare(password,userByEmail.password)
        if(!isPassewordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }


        //token utilisé pour l'authentification
        const token=jwt.sign({userId:userByEmail._id},process.env.SECRET_KEY,{expiresIn:"1d"})
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:"strict"}).json({
            success:true,
            message:`welcome ${userByEmail.firstName}`,
            user: userByEmail 
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to login"
        })
    }
}

export const logout=async(_,res)=>{
    try {
        return res.status(200).cookie("token",{maxAge:0}).json({
            success:true,
            message:`logout successfuly`
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { firstName, lastName, email, password, tel,bio, location } = req.body;
    const file = req.file;

    let cloudResponse;

    // uploader seulement si un fichier existe
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (tel) user.tel = tel;
    if (bio) user.bio = bio;
    if (location) user.location = location;

    // update photo seulement si nouvelle image
    if (cloudResponse) {
      user.photoUrl = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update profile",
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.id } }).select("-password");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch users" });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user, 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};



