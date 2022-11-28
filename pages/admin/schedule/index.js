import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Tab, Typography, Breadcrumbs, Link, Button } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { sendAuthGetRequest } from "../../../common/utils";
import AdminLayout from "../../../component/layout/AdminLayout";
import ScheduleList from "../../../component/admin/schedule/ScheduleList";
import { setCurrentPage } from "../../../features/pathSlice"
import { Add } from "@mui/icons-material";
import ImportThesis from "../../../component/admin/thesis/ImportThesis";


const Schedule = () => {
    const dispatch = useDispatch();

    const [tab, setTab] = useState("1");
    const [onProcess, setOnProcess] = useState(false);
    const [currentSemester, setCurrentSemester] = useState(null);
    const [open, setOpen] = useState(false);

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
                {open ? <ImportThesis open={open} setOpen={setOpen}/> : <></>}
             <TabContext value={tab} sx={{
                width: `100%`,
                height: `100%`
            }}>
                <Grid container width={"100%"} alignItems="center">
                    <Grid md={9} lg={10}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href="/user">
                            Trang chủ
                            </Link>
                            <Typography color="text.primary">Lịch báo cáo</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid md={3} lg={2}>
                    <Button variant="contained" onClick={() => {setOpen(true)}} component="label" startIcon={<Add/>}>
                        Nhập lịch báo cáo
                    </Button>
        </Grid>
                </Grid>
                <Typography variant="h5">Lịch báo cáo luận văn tốt nghiệp</Typography>
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

Schedule.Layout = AdminLayout;
export default Schedule;