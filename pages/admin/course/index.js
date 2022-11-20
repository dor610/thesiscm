import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../../../features/pathSlice";
import AdminLayout from "../../../component/layout/AdminLayout";
import { Box, Breadcrumbs, Button, Divider, LinearProgress, Stack, Tab, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import Link from "next/link";
import { Add } from "@mui/icons-material";
import CourseData from "../../../component/admin/course/CourseData";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateCourse from "../../../component/admin/course/CreateCourse";
import { sendAuthGetRequest } from "../../../common/utils";

const Course = () =>{

    const dispatch = useDispatch();
    const [tab, setTab] = useState('1');
    const [open, setOpen] = useState(false);
    const [currentSemester, setCurrentSemester] = useState(null);

    useEffect(() => {
        dispatch(setCurrentPage("course"));
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
    <Stack direction={"column"} spacing={1} sx={{
        width: `100%`,
        height: `100%`
    }}>
    {open ? <CreateCourse open={open} setOpen={setOpen}/> : <></>}
     <Grid container width={"100%"} alignItems="center">
        <Grid md={9} lg={10} xl={10.5}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/admin">
                Home
                </Link>
                <Typography color="text.primary">Course</Typography>
            </Breadcrumbs>
        </Grid>
        <Grid md={3} lg={2} xl={1.5}>
            <Button variant="contained" onClick={() => {setOpen(true)}} component="label" startIcon={<Add/>}>
                Import
            </Button>
        </Grid>
     </Grid>
    <TabContext value={tab} sx={{
        width: `100%`,
        height: `100%`
    }}>
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
            {currentSemester ? <CourseData /> : <Typography variant="h5">Học kỳ mới vẫn chưa bắt đầu</Typography>}
        </TabPanel>
        <TabPanel value="2" sx={{
            width: `100%`,
            height: `100%`
            }}>
            <CourseData filter={true} />
        </TabPanel>
      </TabContext>
    </Stack>)

}

Course.Layout = AdminLayout;

export default Course;