import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    account: "",
    data: {},
    loginSuccess: false,
    loginFail: false,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAccount: (state, action) =>{
            state.user = action.payload;
        },
        setUserData: (state, action) =>{
            state.data = action.payload; 
        },
        setLoginSuccess: (state, action) =>{
            state.loginSuccess = action.payload;
        },
        setLoginFail: (state, action) =>{
            state.loginFail = action.payload;
        },
        setIsLoggedIn: (state, action) =>{
            state.isLoggedIn = action.payload;
        },
        resetLoginStatus: (state, action) =>{
            state.loginFail = false;
            state.loginSuccess = false;
            state.account = "";
        },
    }
});

export const {setAccount, setUserData, setLoginFail, setLoginSuccess, setIsLoggedIn, resetLoginStatus} = userSlice.actions;

export default userSlice.reducer;