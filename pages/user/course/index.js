import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Stack, Typography, Breadcrumbs, Button, Box, Tab } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import UserLayout from "../../../component/layout/UserLayout";
import AllCourse from "../../../component/user/course/AllCourse";
import CourseDetail from "../../../component/user/course/CourseDetail";
import ImportStudent from "../../../component/user/course/ImportStudent";
import { setCourseLoading, setIsCurrentCourseExist } from "../../../features/courseSlice";
import { setCurrentPage } from "../../../features/pathSlice";

const User = () => {
    const account = useSelector(state => state.user.account);
    const courseLoading = useSelector(state => state.course.loading);
    const isCourseExist = useSelector(state => state.course.isCurrentCourseExist);
    const dispatch = useDispatch();
    const router = useRouter();
    const [tab, setTab] = useState('1');
    const [currentSemester, setCurrentSemester] = useState(null);
    const [open, setOpen] = useState(false);
    const [onProcess, setOnProcess] = useState(false);
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        dispatch(setCurrentPage("course"));
    });

    useEffect(() => {
        getCurrentSemester();
    }, []);

    useEffect(() => {
        if(account) {
            getData();
        }
    }, [account]);

    useEffect(() => {
        if(courseLoading) {
            getData();
        }
    }, [courseLoading]);

    

    const getCurrentSemester = async () =>{
        let result = await sendAuthGetRequest("/api/semester/current");
        if(result.status === 200) {
            setCurrentSemester(result.data);
        }
    }

    const getData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest( `/api/course/account/current?account=${account}`);
        console.log(result);
        if(result.status === 200 ){
            setCourseData(result.data);
            setOnProcess(false);
            dispatch(setIsCurrentCourseExist(true));
            dispatch(setCourseLoading(false));
        } else {
            setOnProcess(false);
            dispatch(setIsCurrentCourseExist(false));
            dispatch(setCourseLoading(false));
        }
    }

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`
        }}>
        {open ? <ImportStudent open={open} setOpen={setOpen}/> : <></>}
         <Grid container width={"100%"} alignItems="center">
            <Grid xs={12} md={8} lg={10}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/user">
                    Home
                    </Link>
                    <Typography color="text.primary">Course</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid xs={12} md={4} lg={2}>
            {tab == 1 && isCourseExist ? <Stack direction={"row"} gap={1}>
                <Button variant="contained" onClick={() => {setOpen(true)}} component="label" startIcon={<Add/>}>
                    Nhập danh sách sinh viên 
                </Button>
            </Stack>: <></>}
            </Grid>
         </Grid>
        <Typography variant="h5">Luận văn tốt nghiệp - KTPM (CT594)</Typography>
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
                    {currentSemester ? <CourseDetail courseData={courseData} isHome={true}/> : <Typography variant="h5">Học kỳ mới vẫn chưa bắt đầu</Typography>}
            </TabPanel>
            <TabPanel value="2" sx={{
                width: `100%`,
                height: `100%`
                }}>
                    <AllCourse />
            </TabPanel>
          </TabContext>
        </Stack>
    )
}

User.Layout = UserLayout;

export default User;