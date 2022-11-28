import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { miliSecToTimeOnly, sendAuthGetRequest } from "../../common/utils";
import { setPresentationGetLog } from "../../features/presentationSlice";
import CustomPagination from "../common/CustomPagination";
import NoRowOverlay from "../common/NoRowOverlay";
import { Unstable_Grid2 as Grid, Typography, Divider, Paper, Link, LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";

const columns = [
    { field: "time", headerName: 'Thời gian', width: 150, flex: 1},
    { field: 'content', headerName: 'Nội dung', width: 150, flex: 4}
  ];


const SumUp = ({thesisData}) => {

    const isGetLog = useSelector(state => state.presentation.isGetLog);
    const account = useSelector(state => state.user.account);
    const [rows, setRows] = useState([]);
    const [onProcess, setOnProcess] = useState(false);
    const dispatch = useDispatch();

    useEffect(() =>{
        if(thesisData) {
            getLogs();
        }
    }, [thesisData])

    useEffect(() => {
        if(isGetLog) {
            getLogs();
        }
    }, [isGetLog]);

    const getLogs = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/presentation/log?id="+thesisData.id);
        console.log(result);
        if(result.status == 200) {
            setRows(result.data.map((row, index) => ({no: index + 1, time: miliSecToTimeOnly(row.timestamp), ...row})));
            setOnProcess(false);
            dispatch(setPresentationGetLog(false));
        }else{
            setOnProcess(false);
            dispatch(setPresentationGetLog(false));
        }
    }

    return (
        <Stack direction={"column"} gap={2} sx={{ width: `100%`, height: `100%`, maxWidth: `1000px`, mx: `auto`}}>
            <Stack direction="column" sx={{width: `100%`}} alignItems="center" >
                <Typography sx={{width: `100%`, textAlign: `center`}} variant="h5">Buổi bảo vệ luận văn tốt nghiệp đại học</Typography>
                <Typography variant="h6" sx={{width: `100%`, textAlign: `center`}}>Học kỳ: {thesisData? thesisData.semester.semesterCode == "1"? "I": "II": ""},
                 Năm học: {thesisData? thesisData.semester.startYear +" - "+ thesisData.semester.endYear: ""}</Typography>
                <Typography sx={{width: `100%`, textAlign: `center`}} variant="h6">Ngành Kỹ thuật phần mềm</Typography>
            </Stack>
            <Paper sx={{p: `20px`}} elevation={2}>
                <Stack direction="column" gap={1} sx={{width: `100%`}}>
                    <Typography variant="h6">{thesisData? thesisData.topic.name: "Tên đề tài"}</Typography>
                    <Typography>{thesisData? thesisData.topic.enName: "Tên tiếng Anh"}</Typography>
                    <Divider />
                    <Grid container sx={{width: `100%`}}>
                        <Grid xs={6}><Typography><span style={{fontWeight: `bold`}}>Thời gian:</span> {thesisData? thesisData.time: ""}</Typography></Grid>
                        <Grid xs={6}><Typography><span style={{fontWeight: `bold`}}>Địa điểm:</span> {thesisData? thesisData.place: ""}</Typography></Grid>
                    </Grid>
                    <Grid container sx={{width: `100%`}}>
                        <Grid xs={12} md={6}><Typography><span style={{fontWeight: `bold`}}>Sinh viên thực hiện:</span> {thesisData? thesisData.student.name: ""}</Typography></Grid>
                        <Grid xs={12} md={6}><Typography><span style={{fontWeight: `bold`}}>MSSV:</span> {thesisData? thesisData.student.studentCode: ""}</Typography></Grid>
                    </Grid>
                    <Grid container sx={{width: `100%`}}>
                        <Grid xs={12} md={6}><Typography><span style={{fontWeight: `bold`}}>Giáo viên hướng dẫn:</span> {thesisData? thesisData.lecturer.name: ""}</Typography></Grid>
                        <Grid xs={12} md={6}><Typography><span style={{fontWeight: `bold`}}>MSGV:</span> {thesisData? thesisData.lecturer.account: ""}</Typography></Grid>
                    </Grid>
                </Stack>
            </Paper>
            <Grid container sx={{width: `100%`}} gap={2}>
                <Grid  xs={12} md={5}>
                    <Paper sx={{ p: `20px`, height: {xs: `auto`, md: `150px`}}} elevation={2}>
                        <Stack direction="column" sx={{width: `100%`}}>
                            <Typography variant="h6">Tài liệu đề tài luận văn</Typography>
                            <Divider />
                            <Grid container sx={{width: `100%`, paddingTop: `10px`}} gap={1}>
                                <Grid xs={12}>
                                    <Typography>Báo cáo: {thesisData && thesisData.topic.reportFile?<Link target={"_blank"} href={thesisData.topic.reportFile.url}>File báo cáo</Link>:<span>Chưa được cập nhật</span>}</Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <Typography>Mã nguồn: {thesisData && thesisData.topic.sourceCode? <Link target={"_blank"} href={thesisData.topic.sourceCode.url}>File mã nguồn</Link>:<span>Chưa được cập nhật</span>}</Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid xs={12} md={6.8}>
                    <Paper sx={{ p: `20px`, height: {xs: `auto`, md: `150px`}}} elevation={2}>
                        <Stack direction="column" sx={{width: `100%`}}>
                            <Typography variant="h6">Hội đồng chấm điểm luận văn</Typography>
                            <Divider />
                            <Grid container sx={{width: `100%`, paddingTop: `10px`}} gap={1}>
                                <Grid xs={12} md={6}>
                                    <Typography>{thesisData? thesisData.president.title + ". " + thesisData.president.name: ""}</Typography>
                                </Grid>
                                <Grid xs={12} md={5}>
                                    <Typography>Chủ tịch hội đồng</Typography>
                                </Grid>
                                <Grid xs={12} md={0}>
                                    <Divider/>
                                </Grid>
                            </Grid>
                            <Grid container sx={{width: `100%`}} gap={1}>
                                <Grid xs={12} md={6}>
                                    <Typography>{thesisData? thesisData.secretary.title +". "+ thesisData.secretary.name: ""}</Typography>
                                </Grid>
                                <Grid xs={12} md={5}>
                                    <Typography>Thư ký hội đồng</Typography>
                                </Grid>
                                <Grid xs={12} md={0}>
                                    <Divider/>
                                </Grid>
                            </Grid>
                            <Grid container sx={{width: `100%`}} gap={1}>
                                <Grid xs={12} md={6}>
                                    <Typography>{thesisData? thesisData.member.title +". "+ thesisData.member.name: ""}</Typography>
                                </Grid>
                                <Grid xs={12} md={5}>
                                    <Typography>Uỷ viên</Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Paper sx={{ p: `20px`,width: `100%`, height: `100%`}} elevation={2}>
                <Stack direction="column" sx={{width: `100%`, height: `300px`}}>
                    {onProcess? <LinearProgress />: <></>}
                    <Typography variant="h6">Hoạt động</Typography>
                    <DataGrid
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      hideFooter
                      rows={rows} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
                </Stack>
            </Paper>
        </Stack>
    )
}
export default SumUp;