import express from 'express'
import {createAd, getAllAds, getUserAds, getAdById, removeAd} from '../controllers/ad.controller.js'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'

const router=express.Router()

router.route('/create').post(isAuthenticated,singleUpload,createAd)
router.route('/ads').get(getAllAds)
router.route('/:id').get(getAdById)
router.route('/delete/:id').delete(isAuthenticated, removeAd)
router.route('/user/:id').get(isAuthenticated, getUserAds)
//router.route('/profile/update').put(isAuthenticated,singleUpload,updateProfile)
//router.route('/test').get(test)

export default router