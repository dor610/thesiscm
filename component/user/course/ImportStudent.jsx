import { Add } from "@mui/icons-material";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMediaPostRequest } from "../../../common/utils";
import { setCourseLoading } from "../../../features/courseSlice";


const ImportStudent = ({open, setOpen , courseId = ""}) =>{
    const account = useSelector(state => state.user.account);
    const [onProcess, setOnProcess] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Chọn file");
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(file);
    })

    const onClose = () => {
        setOpen(false);
    }

    const onSubmit = async () =>{
        let data = new FormData();
        data.append("file", file);
        data.append("account", account);
        let result = await sendMediaPostRequest("/api/student/import", data);
        console.log(result);
        if(result.status == 200) {
            dispatch(setCourseLoading(true));
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Nhập danh sách sinh viên của nhóm học phần</DialogTitle>
        <DialogContent>
          {onProcess? <LinearProgress />: <></>}
          <Stack direction={"column"} sx={{gap: '20px'}}>
          <DialogContentText>
            Chọn file excel dùng để nhập thông tin danh sách sinh viên của nhóm học phần
            <div>
              <i>Lưu ý về file dữ liệu</i>
              <ul>
                <li>Chỉ hỗ trợ định dạng PDF</li>
                <li>Nội dung của file phải được cung cấp bởi Khoa Công nghệ phần mềm</li>
              </ul>
            </div>
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

export default ImportStudent;