import { Box, Divider } from "@mui/material"
import { Stack } from "@mui/system"
import PointSheetForPrint from "./PointSheetForPrint"
import ReportForPrint from "./ReportForPrint"

const Printable = ({thesisData}) => {
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
        </Box>
    )
};

export default Printable;