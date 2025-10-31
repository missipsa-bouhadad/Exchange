import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
        loading:false,
        user:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload;
        },

    }
})

export const {setUser}=authSlice.actions;
export default authSlice.reducer