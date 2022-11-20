import { Add } from "@mui/icons-material";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { sendMediaPostRequest } from "../../../common/utils";


const CreateCourse = ({open, setOpen}) =>{

    const [onProcess, setOnProcess] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Chọn file");

    useEffect(() => {
        console.log(file);
    })

    const onClose = () => {
        setOpen(false);
    }

    const onSubmit = async () =>{
        let data = new FormData();
        data.append("file", file);
        let result = await sendMediaPostRequest("/api/course", data);
        console.log(result);
    }

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Nhập thông tin nhóm học phần</DialogTitle>
        <DialogContent>
          {onProcess? <LinearProgress />: <></>}
          <Stack direction={"column"} sx={{gap: '20px'}}>
          <DialogContentText>
            Chọn file excel dùng để nhập thông tin các nhóm học phần
          </DialogContentText>
          <Stack gap={2} alignItems={"center"} direction={"row"} sx={{width: `100%`}} >
            <Button variant="contained" component="label" >
                Upload
                <input hidden onChange={(e) => {setFile(e.target.files[0]); setFileName(e.target.files[0].name)}} type="file" />
            </Button>
            <Typography>{fileName}</Typography>
          </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="large" variant="outlined" color="secondary" onClick={onClose}>Huỷ</Button>
          <Button size="large" variant="outlined" onClick={onSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>
    )
}

export default CreateCourse;