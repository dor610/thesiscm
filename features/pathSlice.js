import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPath: "/",
    previousPath: "/",
    currentPage: "Home",
    previousPage: "Home",
};

const pathSlice = createSlice({
    name: "path",
    initialState,
    reducers: {
        setCurrentPath: (state, action) => {
            state.currentPath = action.payload;
        },
        setPreviousPath: (state, action) => {
            state.previousPath = action.payload;
        },
        setCurrentPage: (state, action) => {
            if(!(state.currentPage === action.payload)){
                state.previousPage = state.currentPage;
            }
            state.currentPage = action.payload;
        },
        setPreviousPage: (state, action) => {
            state.previousPage = action.payload;
        }
    }
});

export const {setCurrentPath, setPreviousPath, setCurrentPage, setPreviousPage} = pathSlice.actions;
export default pathSlice.reducer;