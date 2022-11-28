import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Unstable_Grid2 as Grid, Tab, Typography, Button, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material"
import { Box, Stack } from "@mui/system"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { sendAuthGetRequest } from "../../common/utils"
import Point from "../../component/presentation/Point"
import Printable from "../../component/presentation/Printable"
import Report from "../../component/presentation/Report"
import ReportForPrint from "../../component/presentation/ReportForPrint"
import SumUp from "../../component/presentation/SumUp"
import Authorization from "../../component/layout/Authorization";
import { Print } from "@mui/icons-material"

const Presetation = () => {

    const account = useSelector(state => state.user.account);
    const router = useRouter();
    const {detail} = router.query;

    const [tab, setTab] = useState("1");
    const [data, setData] = useState(null);

    useEffect(() => {
        if(detail)
            getData();
    }, [detail])

    const getData = async () =>{
        let result = await sendAuthGetRequest("/api/presentation?id="+detail);
        console.log(result);
        if(result.status == 200 && result.data != null) {
            setData({...result.data, dateArr: result.data.date.split("/")});
        }
    }

    const handleChange = (event, newValue) => {
        setTab(newValue);
      }; 

    return (
        <Box sx={{width: `100%`, height: `100%`}}>
            <TabContext value={tab} sx={{width: `100%`}}>
                <Authorization/>
                <Stack direction={"row"} sx={{ borderBottom: 1, borderColor: 'divider', "@media print": {display: `none`} }}>
                <Stack direction={"row"} sx={{width: `35%`, height: `50px`, px: `20px`}} alignItems="center">
                    <Link href={"/user/course"}><Typography variant="h5">Thesiscm</Typography></Link>
                </Stack>   
                <TabList 
                    variant="scrollable"
                    scrollButtons="auto" 
                    onChange={handleChange}>
                    <Tab wrapped label="Tổng quan" value="1" />
                    {data && data.secretary.account == account? <Tab wrapped label="Biên bản" value="2" />: ""} 
                    <Tab wrapped label="Phiếu chấm điểm" value="3" />
                    {data && data.secretary.account == account? <Tab wrapped label="In kết quả đánh giá" value="4" />: ""}
                    <Tab wrapped label="Biên bản" value="5" />
                </TabList>
                </Stack>
                <TabPanel value="1">
                    <SumUp thesisData={data} />
                </TabPanel>
                <TabPanel value="2">
                    <Report thesisData = {data}/>
                </TabPanel>
                <TabPanel value="3">
                    <Point thesisData={data} /> 
                </TabPanel>
                <TabPanel value="4">
                    <Printable thesisData = {data}/>
                </TabPanel>
                <TabPanel value="5">
                    <ReportForPrint thesisData = {data}/>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default Presetation;