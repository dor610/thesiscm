import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    account: "",
    id: "",
    data: {},
    loginSuccess: false,
    loginFail: false,
    isLoggedIn: false,
    isLoggedOut: false,

    userView: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAccount: (state, action) =>{
            state.account = action.payload;
        },
        setUserData: (state, action) =>{
            state.data = action.payload; 
        },
        setUserId: (state, action) => {
            state.id = action.payload;
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
        setIsLoggedOut: (state, action) => {
            state.isLoggedOut = action.payload;
        },
        resetLoginStatus: (state, action) =>{
            state.loginFail = false;
            state.loginSuccess = false;
            state.account = "";
        },
        setUserView: (state, action) =>{
            state.userView = action.payload;
        },
    }
});

export const {setAccount, setUserData, setUserId, setLoginFail, setIsLoggedOut, setLoginSuccess, setIsLoggedIn, resetLoginStatus, setUserView} = userSlice.actions;

export default userSlice.reducer;