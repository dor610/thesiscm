import { MenuItem, Paper, TextField, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Stack } from "@mui/system"
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import PointSheet from "./PointSheet";
import PointSheetForPrint from "./PointSheetForPrint";

const Point = ({thesisData}) => {
    const account = useSelector(state => state.user.account);
    const [value, setValue] = useState("");

    const [users, setUser] = useState([]);

    useEffect(() => {
        if(account != null && thesisData != null) {
            extractUser();
        }
    }, [thesisData. account]);

    const extractUser = () => {
        let arr = [];
        arr.push({value: thesisData.president.account, label: thesisData.president.title + ". " + thesisData.president.name});
        arr.push({value: thesisData.member.account, label: thesisData.member.title + ". " + thesisData.member.name});
        arr.push({value: thesisData.secretary.account, label: thesisData.secretary.title + ". " + thesisData.secretary.name});
        setUser(arr.map(x => {
            if(x.value == account) {
                x.label = "Bạn";
                setValue(x.value);
            }
            return x;
        }));
    }

    return (
        <Stack>
            <Paper elevation={2} sx={{width: `1000px`, mx: `auto`, padding: `20px`}}>
            <Stack direction={"row"} sx={{width: `100%`, mx: `auto`}} gap={2} alignItems="center" justifyContent={"center"}>
                <Typography sx={{width: `50%`}} variant="h6">Bạn đang xem bảng điểm của: </Typography>
                <TextField select={users.length > 0} fullWidth value={value} onChange={e => setValue(e.target.value)} variant="standard">
                {users.length > 0 ? users.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                          </MenuItem >
                    )): ""}
                </TextField>
            </Stack>
            </Paper>
            {value == account? <PointSheet thesisData={thesisData} />: <PointSheetForPrint user={value} thesisData={thesisData} />}
        </Stack>
    )
}

export default Point;