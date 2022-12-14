import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isGetLog: false,
    reloadReport: false,
    isReportApproved: false,
    startPresent: false,
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
        },
        setPresentationPrintable: (state, action) => {
            state.printable = action.payload;
        },
        setStartPresent: (state, action) => {
            state.startPresent = action.payload;
        }
    }
})

export const {setPresentationGetLog, setPresentationReloadReport, setPresentationReportApproved, setPresentationPrintable, setStartPresent} = presentationSlice.actions;

export default presentationSlice.reducer;