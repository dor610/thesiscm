import { Add, Delete } from "@mui/icons-material";
import { Backdrop, Breadcrumbs, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sendAuthGetRequest, sendAuthPostResquest } from "../../../common/utils";
import CourseDetail from "../../../component/admin/course/CourseDetail";
import AdminLayout from "../../../component/layout/AdminLayout"
import { setCurrentPage } from "../../../features/pathSlice";
import { successNotify, errorNotify } from "../../../common/toastify";

const Detail = () =>{

    const router = useRouter();
    const { detail } = router.query;
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);

    const [courseData, setCourseData] = useState(null);
    const [onProcess, setOnProcess] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleBackdropClose = () =>{
        setBackdropOpen(false);
    }

    const deleteCourse = async () => {
        handleClose();
        setBackdropOpen(true);
        let data = new FormData();
        data.append("id", detail);
        let result = await sendAuthPostResquest("/api/course/delete", data);
        if(result.status === 200) {
            successNotify("Đã xoá nhóm học phần thành công");
            setTimeout(() => {
                router.push("/admin/course");
            }, 1500);
        }else {
            errorNotify("Có lỗi xảy ra trong quá trình xoá nhóm học phần");
        }
    }

    useEffect(() => {
        dispatch(setCurrentPage("course"));
    })

    useEffect(() => {
        if(detail && courseData == null) {
            getCourseData(detail);
        }
    }), [detail, courseData]; 

    const getCourseData = async (id) =>{
        setOnProcess(true);
        let result = await sendAuthGetRequest(`/api/course?id=${id}`);
        if(result.status === 200 ){
            setCourseData(result.data);
            setOnProcess(false);
        }
    }

    return (
        <Stack direction={"column"} spacing={2} sx={{
            width: `100%`,
            height: `100%`
        }}>
        <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/admin">
                    Home
                    </Link>
                    <Link underline="hover" color="inherit" href="/admin/course">
                    Course
                    </Link>
                    <Typography color="text.primary">detail</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid md={3} lg={2} xl={1.5}>
                {(courseData && courseData.statusCode != "4")? <Button size="large" variant="contained" onClick={() => {setOpen(true)}} color={"error"} startIcon={<Delete />}>
                    Xoá
                </Button>: <></>}
            </Grid>
        </Grid>
        {courseData? <Stack direction={"column"} sx={{gap: `10px`}}>
            <Typography variant="h5">Luận văn tốt nghiệp - KTPM</Typography>
            <Grid container sx={{
                width: `100%`,
                gap: `10px`
            }}>
                <Grid xs={12} md={5}>
                    <Typography>CT594 - Nhóm {courseData.classCode}</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>Số tín chỉ: 10</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{
                width: `100%`,
                gap: `10px`
            }}>
                <Grid xs={12} md={5}>
                    <Typography>Năm Học: {courseData.semester.startYear + " - " + courseData.semester.endYear}</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>{courseData.semester.semesterName}</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{
                width: `100%`,
                gap: `10px`
            }}>
                <Grid xs={12} md={5}>
                    <Typography>CBGD: {courseData.lecturer.title + ". " +courseData.lecturer.name}</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>MSCB: {courseData.lecturer.account}</Typography>
                </Grid>
            </Grid>
        </Stack> : <Stack direction={"column"} sx={{gap: `10px`}}>
            <Typography variant="h5">Luận văn tốt nghiệp - KTPM</Typography>
            <Grid container sx={{
                width: `100%`,
                gap: `10px`
            }}>
                <Grid xs={12} md={5}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />
                </Grid>
                <Grid xs={12} md={5}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%`  }} />
                </Grid>
            </Grid>
            <Grid container sx={{
                width: `100%`,
                gap: `10px`
            }}>
                <Grid xs={12} md={5}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%`  }} />
                </Grid>
                <Grid xs={12} md={5}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%`  }} />
                </Grid>
            </Grid>
            <Grid container sx={{
                width: `100%`,
                gap: `10px`
            }}>
                <Grid xs={12} md={5}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%`  }} />
                </Grid>
                <Grid xs={12} md={5}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%`  }} />
                </Grid>
            </Grid>
        </Stack> }
        <CourseDetail students={courseData? courseData.studentVO: null}/>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Xác nhận xoá nhóm học phần?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Nhóm học phần bị xoá sẽ không thể phục hồi hoặc tạo nhóm học phần khác với tên nhóm tương tự
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} autoFocus>Huỷ</Button>
            <Button onClick={handleClose} color={"error"}>
                Xoá
            </Button>
            </DialogActions>
        </Dialog>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
            onClick={handleBackdropClose}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
        </Stack>
    )
}

Detail.Layout = AdminLayout;

export default Detail;