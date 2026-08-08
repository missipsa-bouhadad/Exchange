import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/dataUri.js'
import { sendEmail } from '../utils/resend.js'
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password ,bio,location} = req.body
        if (!email || !firstName || !lastName || !password || !bio) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
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
                message: "Email already in use"
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
            message: "Failed to register"
        })

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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
        const { password: _pwd, __v, ...userWithoutPassword } = userByEmail.toObject();
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:"strict"}).json({
            success:true,
            message:`welcome ${userByEmail.firstName}`,
            user: userWithoutPassword
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to login"
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error while logging out"
        });
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
    if (password) user.password = await bcrypt.hash(password, 10);
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

export const toggleFavorite = async (req, res) => {
  try {
    const adId = req.params.adId;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const index = user.favorites.findIndex((fav) => fav.toString() === adId);
    let added;
    if (index >= 0) {
      user.favorites.splice(index, 1);
      added = false;
    } else {
      user.favorites.push(adId);
      added = true;
    }
    await user.save();

    return res.status(200).json({
      success: true,
      added,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating favorites",
    });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate({
      path: "favorites",
      populate: { path: "user", select: "firstName lastName email photoUrl" },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching favorites",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists for this email, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe — Echange Local",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
            <h2 style="color: #5E4D8E;">Mot de passe oublié ?</h2>
            <p>Bonjour ${user.firstName},</p>
            <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe. Le lien expire dans <strong>15 minutes</strong>.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #5E4D8E; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Réinitialiser mon mot de passe
              </a>
            </p>
            <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this message.</p>
          </div>
        `,
      });
    } catch (mailErr) {
      // Rollback du token pour éviter un état incohérent
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      console.error("Resend error:", mailErr);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to process request" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};



