import { Unstable_Grid2 as Grid, Typography, Skeleton, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, AppBar, Toolbar, IconButton, Box, Fade, Step, StepLabel, Stepper, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { forwardRef, useEffect, useState } from "react";
import { sendAuthGetRequest, url } from "../../../common/utils";
import Students from "./Students";
import { useDispatch, useSelector } from "react-redux";
import { setCourseLoading, setIsCurrentCourseExist } from "../../../features/courseSlice";
import { Add, ArrowBack, ArrowBackIos, Close, FileDownload } from "@mui/icons-material";
import ImportStudent from "./ImportStudent";
import { TransitionProps } from '@mui/material/transitions';
import IMarkInput from "./IMarkInput";

const steps = ['Chọn sinh viên', 'Nhập Nội dung đơn', 'Tải lên ảnh đơn'];

const CourseDetail = ({isHome = false, courseData = null}) => {

    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isNext, setIsNext] = useState(false);

  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
    <Stack direction={"column"} gap={2} sx={{width: `100%`, height: `100%`}}>
        { courseData == null && !isHome ? <><Typography variant="h5">Học kỳ mới vẫn chưa bắt đầu</Typography></> : <>
        <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={e => {setOpen(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack>
            <Typography variant={"h6"}>Nhập điểm I cho sinh viên</Typography>
            <Tooltip title={"Đóng"}>
                <IconButton variant={"contained"} size="large" sx={{position: `absolute`, top: `1px`, right: `5%`}} onClick={e => setOpen(false)}>
                    <Close />
                </IconButton>
            </Tooltip>
          </Stack>
          <Divider step={activeStep}/>
        </DialogTitle>
        <DialogContent>
        <Stack direction={"column"}  sx={{width: `100%`, height: `80vh`, overflow: `hidden`}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <Box sx={{width: `100%`, height: `100%`, overflow: `hidden`}}>
                <IMarkInput setIsNext={setIsNext} step={activeStep}/>
            </Box>
            <Divider sx={{width: `100%` ,position: `absolute`, left: 0, bottom: `60px`}} />
            <Box sx={{ display: 'flex', backgroundColor: `white`, width: `100%`, p: `10px`, flexDirection: 'row', position: `absolute`, bottom: 0, left: 0, visibility: activeStep == 3? "hidden": "visible"}}>
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 , visibility: activeStep == 0 || activeStep == 3? "hidden": "visible"}}
                size="large"
                >
                Quay lại
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button size="large" disabled={!isNext} onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Lưu' : 'Tiếp tục'}
                </Button>
            </Box>
        </Stack>
    </DialogContent>
      </Dialog>
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
            <Grid xs={isHome? 12: 0} md={isHome? 5: 0}><Button variant="contained" onClick={() => {setOpen(true)}} component="label" startIcon={<Add/>}>
                    Nhập điểm I 
                </Button></Grid>
            <Grid xs={12} md={5}>
                <a target="_blank" href={url+"/api/course/export?id="+(courseData? courseData.id: "")} rel="noopener noreferrer">
                    <Button variant="contained" component="label" startIcon={<FileDownload/>}>
                        Xuất file điểm
                    </Button>
                </a></Grid>
        </Grid>
        {courseData? <Students students={courseData.studentVO.map((data, index) => ({no: index + 1, ...data}))} />: <></>}
        </>}
    </Stack>
    )
}

export default CourseDetail;