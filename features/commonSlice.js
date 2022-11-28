import { createSlice } from "@reduxjs/toolkit"

const initialState ={
    reloadImark: false,
    reloadOpenConfirmPending: false,
    openConfirmPending: false,
    confirmImarkId: "",
}

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setReloadImark: (state, action) => {
            state.reloadImark = action.payload;
        },
        setOpenConfirmPending: (state, action) => {
            state.openConfirmPending = action.payload;
        },
        setConfirmImarkId: (state, action) => {
            state.confirmImarkId = action.payload;
        }
    }
})


export const { setReloadImark, setOpenConfirmPending, setConfirmImarkId } = commonSlice.actions;

export default commonSlice.reducer;