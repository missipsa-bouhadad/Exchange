/*Redux sert à centraliser tout ton état global dans un seul endroit appelé le store.
Tous les composants peuvent lire ou modifier cet état facilement*/
import { configureStore } from '@reduxjs/toolkit'

import authSlice from './authSlice'


const store=configureStore({
    reducer:{
        auth:authSlice
    }
})

export default store