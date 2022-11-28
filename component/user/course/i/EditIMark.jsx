import { Close, FileUpload } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, Step, StepLabel, Stepper, TextField, Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import { useEffect, useState } from "react";
import { errorNotify, successNotify } from "../../../../common/toastify";
import { sendMediaPostRequest } from "../../../../common/utils";
import Edit from "./Edit";

const steps = ['Nhập Nội dung đơn', 'Tải lên ảnh đơn'];

const EditIMark = ({setReload ,setOpen, data}) =>{

    const [activeStep, setActiveStep] = useState(0);
    const [isNext, setIsNext] = useState(false);
    const [onProcess, setOnProcess] = useState(false);

    const [reason, setReason] = useState("");
    const [lecturerComment, setLecturerComment] = useState("");
    const [deanComment, setDeanComment] = useState("");
    const [other, setOther] = useState(["","","",""]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        if(data) {
            setReason(data.reason);
            setLecturerComment(data.lecturerComment);
            setDeanComment(data.deanComment);
            setOther(JSON.parse(data.other));
            setFileUrl(data.document.viewUrl);
            setFileName(data.document.name);
        }
    }, [data])

    useEffect(() => {
        if(activeStep == 2){
            edit();
        }
    }, [activeStep])

    const edit = async () => {
        setOnProcess(true);
        let formData = new FormData();
        formData.append("id", data.id);
        formData.append("lecturerComment", lecturerComment);
        formData.append("deanComment", deanComment);
        formData.append("reason", reason);
        formData.append("other", JSON.stringify(other));
        if(file) formData.append("file", file);
        let result = await sendMediaPostRequest("/api/course/imark/update", formData);
        if(result.status == 200 && result.data) {
            setReload(true);
            setOnProcess(false);
            successNotify("Cập nhật thông tin điểm I của sinh viên " + data.student.name +" thành công");
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        }else {
            setOnProcess(false);
            errorNotify("Có lỗi xảy ra, vui lòng thực hiện lại!");
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };

    return (
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
                <Typography variant={"h6"}>Chỉnh sửa đơn điểm I của sinh viên {data? data.student.name: "" }</Typography>
                <Tooltip title={"Đóng"}>
                    <IconButton variant={"contained"} size="large" sx={{position: `absolute`, top: `1px`, right: `10px`}} onClick={e => setOpen(false)}>
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
                    <>
                    {activeStep == 0? <Edit data={data} reason={reason} setReason={setReason} lecturerComment={lecturerComment} setLecturerComment={setLecturerComment}
                        deanComment={deanComment} setDeanComment={setDeanComment} other={other} setOther={setOther}/>: activeStep == 1?<Stack>
                        <Stack direction={"column"} sx={{width: `100%`, height: `100%`, overflow: `auto`}} gap={2}>
                            <Stack gap={2} direction={"row"} sx={{width: `60%`, py: `20px`, mx: `auto`}} >
                                <Button variant="contained" startIcon={<FileUpload />} sx={{width: `150px`}} component="label" >
                                    Tải lên
                                    <input hidden onChange={(e) => {setFile(e.target.files[0]); setFileName(e.target.files[0].name); setFileUrl(URL.createObjectURL(e.target.files[0]))}} accept="image/*" type="file" />
                                </Button>
                                <TextField value={fileName} onChange={e => e.preventDefault()} fullWidth/>
                            </Stack>
                            <Stack style={{position: `relative`, width: `100%`, height: `500px`}} alignItems="center" justifyContent={"center"}>
                                 <Image src={fileUrl} layout='fill' objectFit="contain" alt=""/>
                            </Stack>
                        </Stack>
                    </Stack>:<Stack direction={"column"} gap={2} alignItems="center" justifyContent={"center"} sx={{width: `60%`, py: `50px`, mx: `auto`}}>
                            {onProcess? <>
                                <CircularProgress />
                            <Typography>Đang xử lý...</Typography></>:<></>}
                        </Stack>}
                    </>
                </Box>
                <Divider sx={{width: `100%` ,position: `absolute`, left: 0, bottom: `60px`}} />
                <Box sx={{ display: 'flex', backgroundColor: `white`, width: `100%`, p: `10px`, flexDirection: 'row', position: `absolute`, bottom: 0, left: 0, visibility: activeStep == 3? "hidden": "visible"}}>
                    <Button
                    color="inherit"
                    onClick={handleBack}
                    sx={{ mr: 1 , visibility: activeStep == 0 || activeStep == 2? "hidden": "visible"}}
                    size="large"
                    >
                    Quay lại
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button size="large" sx={{visibility: activeStep == steps.length? "hidden": "visible"}} disabled={activeStep == steps.length} onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Lưu' : 'Tiếp tục'}
                    </Button>
                </Box>
            </Stack>
        </DialogContent>
      </Dialog>
    )
}

export default EditIMark;