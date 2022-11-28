import { Unstable_Grid2 as Grid, Typography, Skeleton, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, AppBar, Toolbar, IconButton, Box, Fade, Step, StepLabel, Stepper, Tooltip, DialogActions } from "@mui/material";
import { Stack } from "@mui/system";
import { forwardRef, useEffect, useState } from "react";
import { sendAuthGetRequest, url } from "../../../common/utils";
import Students from "./Students";
import { useDispatch, useSelector } from "react-redux";
import { setCourseLoading, setIsCurrentCourseExist } from "../../../features/courseSlice";
import { Add, ArrowBack, ArrowBackIos, Close, Create, FileDownload } from "@mui/icons-material";
import ImportStudent from "./ImportStudent";
import { TransitionProps } from '@mui/material/transitions';
import IMarkInput from "./IMarkInput";
import { useRouter } from "next/router";
import Link from "next/link";


const CourseDetail = ({isHome = false, courseData = null}) => {

    const [open, setOpen] = useState(false);

    const account = useSelector(state => state.user.account);
    const router = useRouter();

    return (
    <Stack direction={"column"} gap={2} sx={{width: `100%`, height: `100%`}}>
        <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Xuất tệp tin điểm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Chọn loại tệp tin cần xuất. Tệp tin PDF dùng để in, tệp tin Excel dùng để tải dữ liệu lên hệ thống của trường
          </DialogContentText>
          <Stack gap={10} direction="row" alignItems={"center"} justifyContent="center" sx={{width: `100%`, paddingTop: `20px`}}>
          <Link target="_blank" href={"/print/"+(courseData? courseData.id: "")}>
                    <Button variant="contained" component="label" startIcon={<FileDownload/>}>
                        Tệp tin PDF
                    </Button>
                </Link>
            <a target="_blank" href={url+"/api/course/export?id="+(courseData? courseData.id: "")} rel="noopener noreferrer">
                    <Button variant="contained" component="label" startIcon={<FileDownload/>}>
                        Tệp tin Excel
                    </Button>
                </a>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
        { courseData == null && !isHome ? <><Typography variant="h5">Học kỳ mới vẫn chưa bắt đầu</Typography></> : <>
        <Grid gap={1} container sx={{width: `100%`}}>
            <Grid xs={12} md={5}>{courseData != null? <Stack direction={"row"} gap={2} alignItems="center">
                <Typography sx={{fontWeight: `bold`}}>Mã nhóm:</Typography>
                <Typography >{parseInt(courseData.classCode) > 9? courseData.classcode: "0"+courseData.classCode}</Typography>
            </Stack> : <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
            <Grid xs={12} md={5}>{courseData != null? <Stack direction={"row"} gap={2} alignItems="center">
                <Typography sx={{fontWeight: `bold`}}>Số sinh viên:</Typography>
                <Typography >{courseData.students.length}</Typography>
            </Stack> : <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
            <Grid xs={12} md={5}>{courseData != null? <Stack direction={"row"} gap={2} alignItems="center">
                <Typography sx={{fontWeight: `bold`}}>Học kỳ:</Typography>
                <Typography >{courseData.semester.semesterCode == "1"? "I": "II"}</Typography>
            </Stack> : <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
            <Grid xs={12} md={5}>{courseData != null? <Stack direction={"row"} gap={2} alignItems="center">
                <Typography sx={{fontWeight: `bold`}}>Niên khoá:</Typography>
                <Typography >{courseData.semester.startYear +" - " + courseData.semester.endYear}</Typography>
            </Stack> : <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}</Grid>
            {courseData && courseData.lecturer.account == account?  <Grid xs={isHome? 12: 0} md={isHome? 5: 0}><Button variant="contained" onClick={() => {router.push("/user/course/i")}} component="label" startIcon={<Create/>}>
                    Điểm I 
                </Button></Grid>:<></>}
            {courseData && courseData.lecturer.account == account? <Grid xs={12} md={5}>
                    <Button variant="contained" onClick={() => setOpen(true)} component="label" startIcon={<FileDownload/>}>
                        Xuất file điểm
                    </Button></Grid>: <></>}
        </Grid>
        {courseData? <Students students={courseData.studentVO.map((data, index) => ({no: index + 1, ...data}))} />: <></>}
        </>}
    </Stack>
    )
}

export default CourseDetail;