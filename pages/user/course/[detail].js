import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Stack, Typography, Breadcrumbs, Button, Box, Tab, Divider, Skeleton } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import UserLayout from "../../../component/layout/UserLayout";
import AllCourse from "../../../component/user/course/AllCourse";
import CourseDetail from "../../../component/user/course/CourseDetail";
import ImportStudent from "../../../component/user/course/ImportStudent";
import Students from "../../../component/user/course/Students";
import { setIsCurrentCourseExist } from "../../../features/courseSlice";
import { setCurrentPage } from "../../../features/pathSlice";

const Detail = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { detail } = router.query;
    const [courseData, setCourseData] = useState(null);
    const [onProcess, setOnProcess] = useState(false);

    useEffect(() => {
        dispatch(setCurrentPage("course"));
    })

    useEffect(() => {
        if(detail) {
            getData();
        }
    }, [detail]);

    const getData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest( `/api/course?id=${detail}`);
        console.log(result);
        if(result.status === 200 ){
            setCourseData(result.data);
            setOnProcess(false);
        } else {
            setOnProcess(false);
        }
    }

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`
        }}>
         <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/user">
                    Trang chủ
                    </Link>
                    <Link underline="hover" color="inherit" href="/user/course">
                    Nhóm học phần
                    </Link>
                    <Typography color="text.primary">Chi tiết</Typography>
                </Breadcrumbs>
            </Grid>
         </Grid>
        <Typography variant="h5">Luận văn tốt nghiệp - KTPM (CT594)</Typography>
        <Divider />
        <Stack direction={"column"} gap={2} sx={{width: `100%`, height: `100%`}}>
            { courseData == null ?<><Typography variant="h5">Học kỳ mới vẫn chưa bắt đầu</Typography></> : <>
            <Grid gap={1} container sx={{width: `100%`, py: `10px`}}>
                <Grid xs={12} md={5}>{courseData != null? <Typography><span style={{fontWeight:'bold'}}>Mã nhóm: </span> {parseInt(courseData.classCode) > 9? courseData.classcode: "0"+courseData.classCode}</Typography>:
                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
                <Grid xs={12} md={5}>{courseData != null?<Typography><span style={{fontWeight:'bold'}}>Số sinh viên: </span> {courseData.students.length}</Typography>:
                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
                <Grid xs={12} md={5}>{courseData != null? <Typography><span style={{fontWeight:'bold'}}>Học kỳ: </span> {courseData.semester.semesterCode == "1"? "I": "II"}</Typography>:
                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
                <Grid xs={12} md={5}>{courseData != null?<Typography><span style={{fontWeight:'bold'}}>Niên khoá: </span> {courseData.semester.startYear +" - " + courseData.semester.endYear}</Typography>:
                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
            </Grid>
            {courseData? <Students students={courseData.studentVO.map((data, index) => ({no: index + 1, ...data}))} />: <></>}
            </>}
        </Stack>
        </Stack>
    )
}

Detail.Layout = UserLayout;

export default Detail;