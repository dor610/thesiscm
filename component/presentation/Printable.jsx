import { Print } from "@mui/icons-material";
import { Box, Divider, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { Stack } from "@mui/system"
import { useState } from "react";
import PointSheetForPrint from "./PointSheetForPrint"
import ReportForPrint from "./ReportForPrint"

const Printable = ({thesisData}) => {

    
    const [open, setOpen] = useState(false);

    const print = () => {
        window.print();
      }

    const actions = [
       { icon: <Print />, name: 'In tài liệu', onClick: print},
    ];

    return (
        <Box sx={{width: `100%`, height: `auto`}}>
            <PointSheetForPrint user={thesisData.president.account} thesisData={thesisData}/>
            <Box sx={{width: `100%`, height: `310px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
            <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                <Divider />
            </Stack>
            <PointSheetForPrint user={thesisData.secretary.account} thesisData={thesisData}/>
            <Box sx={{width: `100%`, height: `330px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
            <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                <Divider />
            </Stack>
            <PointSheetForPrint user={thesisData.member.account} thesisData={thesisData}/>
            <Box sx={{width: `100%`, height: `310px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
            <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                <Divider />
            </Stack>
            <ReportForPrint printable={true} thesisData={thesisData}/>

            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'fixed', bottom: `5%`, right: `3%`, "@media print": {display: `none`}}}
                icon={<SpeedDialIcon />}
                open={open}
                onOpen={e => setOpen(true)}
                onClose={e => setOpen(false)}
            >
                {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={e => {action.onClick(); setOpen(false)}}
                />
                ))}
            </SpeedDial>
        </Box>
    )
};

export default Printable;