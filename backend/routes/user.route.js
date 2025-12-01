import express from 'express'
import {register,login, logout,updateProfile, getAllUsers} from '../controllers/user.controller.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'

const router=express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/update').put(isAuthenticated,singleUpload,updateProfile)
router.get("/", isAuthenticated, getAllUsers);

export default router