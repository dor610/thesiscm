import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isGetLog: false,
    reloadReport: false,
    isReportApproved: false,
}

const presentationSlice = createSlice({
    name: "presentation",
    initialState,
    reducers: {
        setPresentationGetLog: (state, action) =>{
            state.isGetLog = action.payload;
        }, 
        setPresentationReloadReport: (state, action) => {
            state.reloadReport = action.payload;
        },
        setPresentationReportApproved: (state, action) => {
            state.isReportApproved = action.payload;
        }
    }
})

export const {setPresentationGetLog, setPresentationReloadReport, setPresentationReportApproved} = presentationSlice.actions;

export default presentationSlice.reducer;