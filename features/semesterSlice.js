import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    onEdit: false,
    editId: "",
}

const semesterSlice = createSlice({
    name: "semester",
    initialState,
    reducers: {
        setSemesterOnEdit: (state, action) => {
            state.onEdit = action.payload;
        },
        setSemesterEditId: (state, action) =>{
            state.editId  =action.payload;
        }
    }
})

export const { setSemesterOnEdit, setSemesterEditId } = semesterSlice.actions;

export default semesterSlice.reducer;