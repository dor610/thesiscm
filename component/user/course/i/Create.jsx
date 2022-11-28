import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Step, StepLabel, Stepper, Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import IMarkInput from "../IMarkInput";

const steps = ['Chọn sinh viên', 'Nhập Nội dung đơn', 'Tải lên ảnh đơn'];

const Create = ({open, setOpen}) => {

    const [activeStep, setActiveStep] = useState(0);
    const [isNext, setIsNext] = useState(false);

  
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
            <Typography variant={"h6"}>Nhập điểm I cho sinh viên</Typography>
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
                <IMarkInput setIsNext={setIsNext} step={activeStep} setOpen={setOpen}/>
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
    )
}

export default Create;