import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Tab, Typography, Breadcrumbs, Link } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { sendAuthGetRequest } from "../../../common/utils";
import UserLayout from "../../../component/layout/UserLayout";
import ScheduleList from "../../../component/user/schedule/ScheduleList";
import { setCurrentPage } from "../../../features/pathSlice"


const Schedule = () => {
    const account = useSelector(state => state.user.account);
    const dispatch = useDispatch();

    const [tab, setTab] = useState("1");
    const [onProcess, setOnProcess] = useState(false);
    const [currentSemester, setCurrentSemester] = useState(null);

    useEffect(() =>{
        dispatch(setCurrentPage("schedule"));
    })

    useEffect(() => {
        getCurrentSemester();
    }, []);

    const getCurrentSemester = async () =>{
        let result = await sendAuthGetRequest("/api/semester/current");
        if(result.status === 200) {
            setCurrentSemester(result.data);
        }
    }

    return (
        <Stack direction={"column"} sx={{
            width: `100%`,
            height: `100%`,
            overflow: `auto`,
            '&::-webkit-scrollbar': {
                display: `none`,
            } }}>
             <TabContext value={tab} sx={{
                width: `100%`,
                height: `100%`
            }}>
                <Grid container width={"100%"} alignItems="center">
                    <Grid md={9} lg={10} xl={10.5}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href="/user">
                            Home
                            </Link>
                            <Typography color="text.primary">Schedule</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid md={3} lg={2} xl={1.5}>
                    </Grid>
                </Grid>
                <Typography variant="h5">Lịch chấm điểm luận văn tốt nghiệp</Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                    <Tab label={currentSemester? currentSemester.semesterName : "Học kỳ hiện tại"} value="1" />
                    <Tab label="Tất cả" value="2" />
                </TabList>
                </Box>
                <TabPanel value="1" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        {currentSemester ? <ScheduleList/> : <Typography variant="h5" sx={{width: `100%`, textAlign: "center", paddingTop: `20%`}}>Hiện tại không có lịch chấm điểm luận văn nào</Typography>}
                </TabPanel>
                <TabPanel value="2" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        <ScheduleList filter={true} />
                </TabPanel>
          </TabContext>
        </Stack>
    )
}

Schedule.Layout = UserLayout;
export default Schedule;