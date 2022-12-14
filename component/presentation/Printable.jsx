import { Print } from "@mui/icons-material";
import { Box, Divider, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { Stack } from "@mui/system"
import { useState } from "react";
import PointSheetForPrint from "./PointSheetForPrint"
import ReportForPrint from "./ReportForPrint"

const Printable = ({thesisData}) => {

    
    const [open, setOpen] = useState(false);
    const [printable1, setPrintable1] = useState(false);
    const [printable2, setPrintable2] = useState(false);
    const [printable3, setPrintable3] = useState(false);
    const [printable4, setPrintable4] = useState(false);

    const print = () => {
        window.print();
      }

    const actions = [
       { icon: <Print />, name: 'In tài liệu', onClick: print},
    ];

    return (
        <Box sx={{width: `100%`, height: `auto`}}>
            <PointSheetForPrint user={thesisData.president.account} setPrintable={setPrintable1} thesisData={thesisData}/>
            <Box sx={{width: `100%`, height: `310px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
            <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                <Divider />
            </Stack>
            <PointSheetForPrint user={thesisData.secretary.account} setPrintable={setPrintable2} thesisData={thesisData}/>
            <Box sx={{width: `100%`, height: `330px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
            <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                <Divider />
            </Stack>
            <PointSheetForPrint user={thesisData.member.account} setPrintable={setPrintable3} thesisData={thesisData}/>
            <Box sx={{width: `100%`, height: `310px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
            <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                <Divider />
            </Stack>
            <ReportForPrint printable={true}  setPrintable={setPrintable4} thesisData={thesisData}/>

            {printable1 && printable2 && printable3 && printable4? <SpeedDial
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
            </SpeedDial>: <></>}
        </Box>
    )
};

export default Printable;