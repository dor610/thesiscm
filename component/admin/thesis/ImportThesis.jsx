import { Add } from "@mui/icons-material";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMediaPostRequest } from "../../../common/utils";
import { setCourseLoading } from "../../../features/courseSlice";


const ImportThesis = ({open, setOpen , courseId = ""}) =>{
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
        let result = await sendMediaPostRequest("/api/presentation/import", data);
        console.log(result);
        if(result.status == 200) {
            dispatch(setCourseLoading(true));
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Tạo các lịch báo cáo bảo vệ luận văn</DialogTitle>
        <DialogContent>
          {onProcess? <LinearProgress />: <></>}
          <Stack direction={"column"} sx={{gap: '20px'}}>
          <DialogContentText>
            <Typography>Chọn file dùng để tạo lịch báo cáo bảo vệ luận văn cho các đề tài luận văn ở học kỳ hiện tại</Typography>
            <div><i>Một số lưu ý về file dữ liệu</i></div>
            <ul>
                <li><i>Chỉ hỗ trợ định dạng file PDF</i></li>
                <li><i>File dữ liệu phải được cung cấp bởi Khoa Công nghệ phần mềm, hoặc tạo ra với định dạng và dữ liệu tương tự</i></li>
                <li><i>File dữ liệu phải được xuất ra từ các trình soạn thảo văn bản. Không chứa ảnh chụp hoặc scan bằng máy.</i></li>
            </ul>
          </DialogContentText>
          <Stack gap={2} alignItems={"center"} direction={"row"} sx={{width: `100%`}} >
            <Button variant="contained" component="label" >
                Upload
                <input hidden accept=".pdf" onChange={(e) => {setFile(e.target.files[0]); setFileName(e.target.files[0].name)}} type="file" />
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

export default ImportThesis;