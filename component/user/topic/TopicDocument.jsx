import { Add, Delete } from "@mui/icons-material";
import { Button,Unstable_Grid2 as Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Alert, Divider, Link } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { miliSecToDate, miliSecToDateOnly, sendAuthGetRequest, sendAuthPostResquest, sendMediaPostRequest } from "../../../common/utils";

const TopicDocument = ({id = "", topicData}) => {

    const account = useSelector(state => state.user.account);
    const [onProcess, setOnProcess] = useState(false);
    const [upLoadOpen, setUploadOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [target, setTarget] = useState("");
    const [reload, setReload] = useState(false);
    const [fileName, setFileName] = useState("Chọn tệp tin");
    const [file, setFile] = useState(null);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [isUploadError, setIsUploadError] = useState(false);

    const [data, setData] = useState(null);


    useEffect(() =>{
        if((id != "" && data == null) || reload) {
            getData();
        }
    }, [id, data, reload]);

    const getData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/topic/document?id="+id);
        if(result.status === 200) {
            setData(result.data);
            setOnProcess(false);
            setReload(false);
        } else {
            setOnProcess(false);
            setReload(false);
        }
    }

    const upload = async () => {
        setOnProcess(true);
        if(file == null) {
            setIsUploadError(true);
            setMessage("Vui lòng chọn tệp tin");
        } else {
            setIsUploadError(false);
            let uploadData = new FormData();
            uploadData.append("id", id);
            uploadData.append("file", file);
            let result = await sendMediaPostRequest(target == 1? "/api/topic/document/sourceCode": "/api/topic/document/reportFile", uploadData);
            if (result.status === 200) {
                setOnProcess(false);
                setReload(true);
                setIsSuccess(true);
                setMessage(`Cập nhật ${target == 1? "Mã nguồn": "Tài liệu báo cáo"} thành công`);
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
                closeUploadDialog();
            } else {
                setOnProcess(false);
                setMessage(`Có lỗi xảy ra khi xoá tệp tin ${target == 1? "Mã nguồn": "Tài liệu báo cáo"}`);
                setIsUploadError(true);
                setTimeout(() => {
                    setIsUploadError(false);
                }, 3000);
            }
        }
    }

    const deleteFile = async () => {
        setOnProcess(true);
        const deleteData = new FormData();
        deleteData.append("id", id);
        let result = await sendAuthPostResquest(target == 1? "/api/topic/document/deleteSourceCode": "/api/topic/document/deleteReportFile", deleteData);
        console.log(result);
        if(result.status === 200) {
            setOnProcess(false);
            setReload(true);
            setMessage(`Xoá ${target == 1? "Mã nguồn": "Tài liệu báo cáo"} thành công`);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
            closeDeleteDialog();
        }else {
            setOnProcess(false);
            setMessage(`Có lỗi xảy ra khi xoá tệp tin ${target == 1? "Mã nguồn": "Tài liệu báo cáo"}`);
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
            }, 3000);
            closeDeleteDialog();
        }
    }

    const openUploadDialog = () =>{
        setUploadOpen(true);
    }

    const openDeleteDialog = () =>{
        setDeleteOpen(true);
    }

    const closeUploadDialog = () => {
        setUploadOpen(false);
        setFile(null);
        setFileName("Chọn tệp tin");
    }

    const closeDeleteDialog = () => {
        setDeleteOpen(false);
    }

    return (
        <Stack direction="column" gap={2} sx={{width: `100%`}}>
            {isError? <Alert severity="error">{message}</Alert>:<></>}
            {isSuccess? <Alert severity="success">{message}</Alert>:<></>}
            <Dialog open={upLoadOpen} onClose={closeUploadDialog}>
                <DialogTitle>Cập nhật {target == 1? "Mã nguồn": "Tài liệu báo cáo"}</DialogTitle>
                <DialogContent>
                <Stack direction="column" gap={2} sx={{width: `100%`}}>
                <DialogContentText>
                Cập nhật tệp tin {target == 1? "Mã nguồn": "Tài liệu báo cáo"} đã được lưu trước đó. Nếu tệp tin đã tồn tại thì sẽ bị ghi đè.
                </DialogContentText>
                {onProcess? <LinearProgress />: <></>}
                <Stack gap={2} alignItems={"center"} direction={"row"} sx={{width: `100%`}} >
                    <Button variant="contained" component="label" >
                        Chọn tệp
                        <input hidden onChange={(e) => {setFile(e.target.files[0]); setFileName(e.target.files[0].name)}} type="file" />
                    </Button>
                    <Typography>{fileName}</Typography>
                </Stack>
                </Stack>
                </DialogContent>
                <DialogActions>
                <Button color="secondary" onClick={closeUploadDialog}>Huỷ</Button>
                <Button color="primary" onClick={upload}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Xoá {target == 1? "Mã nguồn": "Tài liệu báo cáo"}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                {onProcess? <LinearProgress />: <></>}
                <Typography component={'span'} >Xoá tệp tin {target == 1? "Mã nguồn": "Tài liệu báo cáo"} đã được lưu trước đó. Tệp tin bị xoá sẽ không thể phục hồi</Typography>
                </DialogContentText>
                <Typography></Typography>
                </DialogContent>
                <DialogActions>
                <Button color="primary" onClick={closeDeleteDialog}>Huỷ</Button>
                <Button color="error" onClick={deleteFile}>Xoá</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h6">Mã nguồn</Typography>
            <Grid container>
                <Grid xs={12} md={9} lg={10}>
                    {data != null && data[0] != null ?
                    <Grid container gap={1} sx={{width: `100%`}}>
                        <Grid xs={12} md={7} ><span style={{fontWeight: 'bold'}}>Tên tệp tin:</span> {data[0].name}</Grid>
                        <Grid xs={12} md={4} ><span style={{fontWeight: 'bold'}}>Loại tệp tin:</span> {data[0].extension}</Grid>
                        <Grid xs={12} md={7} ><span style={{fontWeight: 'bold'}}>Ngày cập nhật:</span> {miliSecToDate(data[0].createdDate)}</Grid>
                        <Grid xs={12} md={4} ><span style={{fontWeight: 'bold'}}>Kích thước:</span> {data[0].size} bytes</Grid>
                        <Grid xs={12} ><span style={{fontWeight: 'bold'}}>Liên kết:</span> <Link target={"_blank"} href={data[0].url}>Tải mã nguồn</Link></Grid>
                    </Grid> :
                    <Typography>Thông tin về mã nguồn chưa được cập nhật</Typography>}
                </Grid>
                <Grid xs={12} md={3} lg={2}>
                    {topicData? topicData.lecturer.account == account? <Stack direction={{xs: "row", md: "column"}} sx={{py: `10px`}} justifyContent={{xs: "normal", md: "center"}} gap={2}>
                            <Button onClick={() => {setTarget(1); openUploadDialog()}} color="success" variant="contained" startIcon={<Add />}>Cập nhật</Button>
                            <Button onClick={() => {setTarget(1); openDeleteDialog()}} disabled={!(data != null && data[0] != null)} color="error" variant="contained" startIcon={<Delete />}>Xoá</Button>
                    </Stack>: <></>: <></>}
                </Grid>
            </Grid>
            <Divider />
            <Typography variant="h6">Tài liệu báo cáo</Typography>
            <Grid container>
                <Grid xs={12} md={9} lg={10}>
                    {data != null && data[1] != null ?
                        <Grid container gap={1} sx={{width: `100%`}}>
                            <Grid xs={12} md={7} ><span style={{fontWeight: 'bold'}}>Tên tệp tin:</span> {data[1].name}</Grid>
                            <Grid xs={12} md={4} ><span style={{fontWeight: 'bold'}}>Loại tệp tin:</span> {data[1].extension}</Grid>
                            <Grid xs={12} md={7} ><span style={{fontWeight: 'bold'}}>Ngày cập nhật:</span> {miliSecToDate(data[1].createdDate)}</Grid>
                            <Grid xs={12} md={4} ><span style={{fontWeight: 'bold'}}>Kích thước:</span> {data[1].size} bytes</Grid>
                            <Grid xs={12} ><span style={{fontWeight: 'bold'}}>Liên kết:</span> <Link target={"_blank"} href={data[1].url}>Tải tài liệu báo cáo</Link></Grid>
                        </Grid> :
                        <Typography>Thông tin về tài liệu báo cáo chưa được cập nhật</Typography>}      
                </Grid>
                <Grid xs={12} md={3} lg={2}>
                    {topicData? topicData.lecturer.account == account? <Stack direction={{xs: "row", md: "column"}} sx={{py: `10px`}} justifyContent={{xs: "normal", md: "center"}} gap={2}>
                        <Button onClick={() => {setTarget(2); openUploadDialog()}} color="success" variant="contained" startIcon={<Add />}>Cập nhật</Button>
                        <Button onClick={() => {setTarget(2); openDeleteDialog()}} disabled={!(data != null && data[1] != null)} color="error" variant="contained" startIcon={<Delete />}>Xoá</Button>
                    </Stack>: <></>: <></>}
                </Grid>
            </Grid>
        </Stack> 
    )
}

export default TopicDocument;