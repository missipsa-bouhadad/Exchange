import express from 'express'
import {register,login, logout,updateProfile, getMe, getUserById, forgotPassword, resetPassword, toggleFavorite, getMyFavorites} from '../controllers/user.controller.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'

const router=express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/update').put(isAuthenticated,singleUpload,updateProfile)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)
router.get("/me", isAuthenticated, getMe);
router.get("/favorites", isAuthenticated, getMyFavorites);
router.post("/favorites/:adId", isAuthenticated, toggleFavorite);
router.get("/:id", isAuthenticated, getUserById);


export default router