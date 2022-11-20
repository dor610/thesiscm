import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    isCurrentCourseExist: false,
    isCourseReload: false,
}

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCourseLoading: (state, action) => {
            state.loading = action.payload;
        },
        setIsCurrentCourseExist: (state, action) => {
            state.isCurrentCourseExist = action.payload;
        },
        setIsCourseReload: (state, action) =>{
            state.isCourseReload = action.payload;
        }
    }
})

export const { setCourseLoading, setIsCurrentCourseExist, setIsCourseReload } = courseSlice.actions;
export default courseSlice.reducer;