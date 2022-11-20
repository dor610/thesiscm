import { createSlice } from "@reduxjs/toolkit"

const initialState ={
    iMarkTopicId: "",
    iMarkStudentId: "",

}

const topicSlice = createSlice({
    name: "topic",
    initialState,
    reducers: {
        setIMarkTopicId: (state, action) =>{
            state.iMarkTopicId = action.payload;
        },
        setIMarkStudentId: (state, action) => {
            state.iMarkStudentId = action.payload;
        }
    }
});

export const {setIMarkStudentId, setIMarkTopicId} = topicSlice.actions;

export default topicSlice.reducer;