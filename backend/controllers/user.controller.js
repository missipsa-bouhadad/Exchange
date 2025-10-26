import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!email || !firstName || !lastName || !password) {
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
            firstName, lastName, email, password: hashPassword
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
            userByEmail
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