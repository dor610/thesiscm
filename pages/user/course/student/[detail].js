import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Breadcrumbs, Chip, Unstable_Grid2 as Grid, LinearProgress, Link, Skeleton, Tab, Typography, Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { miliSecToDateOnly, sendAuthGetRequest } from "../../../../common/utils";
import UserLayout from "../../../../component/layout/UserLayout";
import Course from "../../../../component/user/search/Course";
import StudentTopic from "../../../../component/user/search/StudentTopic";
import { setCurrentPage } from "../../../../features/pathSlice";

const Student = () => {

    const router = useRouter();
    const { detail } = router.query;
    const dispatch = useDispatch();
    const [onProcess, setOnProcess] = useState(false);
    const [tab, setTab] = useState("1")

    const [student, setStudent] = useState(null);
    const [course, setCourse] = useState([]);
    const [topic, setTopic] = useState([]);

    useEffect(() => {
        dispatch(setCurrentPage("course"));
    })

    useEffect(() =>{
        if(detail){
            getStudent();
        }
    }, [detail]);

    useEffect(() =>{
        if(student) {
            getCourse();
            getTopic();
        }
    }, [student]);

    const getStudent = async () =>{
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/student?id=" + detail);
        console.log(result);
        if(result.status == 200) {
            setOnProcess(false);
            setStudent(result.data);
            setOnProcess(false);
        } else {
            setOnProcess(false);
            setOnProcess(false);
        }
    }

    const getTopic = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/topic/student?student="+student.id);
        console.log(result);
        if(result.status == 200) {
            setOnProcess(false);
            setTopic(result.data.map((obj, index) => ({
                no: index + 1,
                lecturerName: obj.lecturer.title + ". " + obj.lecturer.name,
                semesterName: obj.semester.semesterCode == "1"? "I": "II",
                schoolYear: obj.semester.startYear + " - " + obj.semester.endYear,
                ...obj,
            })));
        } else {
            setOnProcess(false);
        }
    }

    const getCourse = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/course/student?student="+student.studentCode);
        if(result.status == 200) {
            setOnProcess(false);
            setCourse(result.data.map((obj, index) => ({
                no: index + 1,
                courseNumber: "CT594"+ (obj.classCode.lenght > 1? obj.classCode : "0"+obj.classCode),
                lecturerName: obj.lecturer.title + ". " + obj.lecturer.name,
                semesterName: obj.semester.semesterCode == "1"? "I": "II",
                schoolYear: obj.semester.startYear + " - " + obj.semester.endYear,
                ...obj,
            })));
        } else {
            setOnProcess(false);
        }
    }

    return (
        <Stack direction={"column"} gap={1} sx={{
            width: `100%`,
            overflowY: `auto`,
            overflowX: 'hidden',
            height: `100%`,
        }}>
            {onProcess? <LinearProgress/>:<></>}
            <Grid container width={"100%"} alignItems="center">
                <Grid md={9} lg={10} xl={10.5}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/user">
                        Trang chủ
                        </Link>
                        <Link underline="hover" color="inherit" href="/user/course">
                        Nhóm học phần
                        </Link>
                        <Typography color="text.primary">Sinh viên</Typography>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            {student? <Typography variant="h5">Thông tin sinh viên {student? student.name: ""}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
            <Divider />
            <Grid container xs={12} spacing={2} sx={{width: `100%`, py: `10px`}}>
                            <Grid xs={12} md={5}>
                                {student? <Typography><span style={{fontWeight: `bold`}}>Họ tên:</span> {student.name}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                            </Grid>
                            <Grid xs={12} md={5}>
                                {student?<Typography><span style={{fontWeight: `bold`}}>MSSV:</span> {student.studentCode}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                            </Grid>
                            <Grid xs={12} md={5}>
                                {student?<Typography><span style={{fontWeight: `bold`}}>Ngành học:</span> Kỹ thuật phần mềm</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                            </Grid>
                            <Grid xs={12} md={5}>
                                {student?<Typography><span style={{fontWeight: `bold`}}>Mã lớp:</span> {student.classCode}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                            </Grid>
                            <Grid xs={12} md={5}>
                                {student?<Typography><span style={{fontWeight: `bold`}}>Ngày sinh:</span> {miliSecToDateOnly(student.dateOfBirth)}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                            </Grid>
                            <Grid xs={12} md={5}>
                                {student?<Typography><span style={{fontWeight: `bold`}}>Email:</span> {student.email}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                            </Grid>
                        </Grid>
            <TabContext value={tab} sx={{
                width: `100%`,
                height: `100%`
            }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                    <Tab label="Nhóm học phần" value="1" />
                    <Tab label="Đề tài luận văn" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        <Course data={course} />
                </TabPanel>
                <TabPanel value="2" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                      <StudentTopic data={topic} />
                </TabPanel>
              </TabContext>
        </Stack>
    )
}

Student.Layout = UserLayout;

export default Student;