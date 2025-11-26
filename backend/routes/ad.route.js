import express from 'express'
import {createAd, getAllAds} from '../controllers/ad.controller.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'

const router=express.Router()

router.route('/create').post(createAd)
router.route('/ads').get(getAllAds)
//router.route('/profile/update').put(isAuthenticated,singleUpload,updateProfile)
//router.route('/test').get(test)

export default router