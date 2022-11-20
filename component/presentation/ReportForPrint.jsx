import { Alert, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../common/toastify";
import { convertNumberMarkToLetterMark, sendAuthGetRequest, sendAuthPostResquest } from "../../common/utils";
import { setPresentationGetLog, setPresentationReloadReport } from "../../features/presentationSlice";

const ReportForPrint = ({thesisData, printable=false}) =>{
    const account = useSelector(state => state.user.account);
    const dispatch = useDispatch();
    const isReloadReport = useSelector(state => state.presentation.reloadReport);
    const [onProcess, setOnProcess] = useState(false);

    const [qna, setQna] = useState("");
    const [advices, setAdvices] = useState("");
    const [comment, setComment] = useState("");
    const [presentationResult, setPresentationResult] = useState("");
    const [finalPoint, setFinalPoint] = useState("");
    const [otherThing, setOtherThing] = useState(["", "", "", ""]);
    const [endTime, setEndTime] = useState("");
    const [data, setData] = useState(null);


    const [presidentPoint, setPresidentPoint] = useState(0);
    const [secretaryPoint, setSecretaryPoint] = useState(0);
    const [memberPoint, setMemberPoint] = useState(0);
    const [totalPoint, setTotalPoint] = useState(0);


    useEffect(() => {
        if(account && thesisData) {
            getData();
        }
    }, [account, thesisData]);
    
    useEffect(() => {
        if(isReloadReport)
            getData();
    }, [isReloadReport]);

    
    useEffect(() => {
        setTotalPoint(Math.round((((presidentPoint + secretaryPoint + memberPoint)/3) + Number.EPSILON) * 100) / 100);
    }, [presidentPoint, secretaryPoint, memberPoint]);


    const getData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/report/presentaion?id="+thesisData.id);
        console.log(result);
        if(result.status == 200) {
            let tData = result.data;
            setQna(tData.qna);
            setAdvices(tData.advices);
            setComment(tData.comment);
            setPresentationResult(tData.result);
            setFinalPoint(tData.finalPoint);
            setEndTime(tData.endTime);
            setOtherThing(tData.other.split(","));
            setData(tData);
            getPoint();
            dispatch(setPresentationReloadReport(false));
            setOnProcess(false);
        }else {
            dispatch(setPresentationReloadReport(false));
            setOnProcess(false);
        }
    }

    const getPoint = async () =>{
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/point/report?id="+thesisData.id);
        if(result.status == 200) {
            result.data.forEach(element => {
                if(element.creator.account == thesisData.president.account){
                    setPresidentPoint(Math.round(((element.aTotalPoint + element.bTotalPoint + element.cTotalPoint) + Number.EPSILON) * 100) / 100);
                }
                if(element.creator.account == thesisData.secretary.account){
                    setSecretaryPoint(Math.round(((element.aTotalPoint + element.bTotalPoint + element.cTotalPoint) + Number.EPSILON) * 100) / 100);
                }
                if(element.creator.account == thesisData.member.account){
                    setMemberPoint(Math.round(((element.aTotalPoint + element.bTotalPoint + element.cTotalPoint) + Number.EPSILON) * 100) / 100);
                }
            });
            setOnProcess(false);
        }else {
            setOnProcess(false);
        }
    }

    const approve = async () =>{
            setOnProcess(true);
            let formData = new FormData();
            formData.append("id", data.id);
        let result = await sendAuthPostResquest("/api/report/approve", formData);
        console.log(result);
        if(result.status == 200) {
            successNotify("Biên bản đã được xác nhận thành công");
            dispatch(setPresentationReloadReport(true));
            setOnProcess(false);
            writeLogOnSubmit();
        } else {
            errorNotify("Đã có lỗi xảy ra, vui lòng thực hiện lại");
            setOnProcess(false);
        }
    }

    const writeLogOnSubmit = async () => {
        let message = "Biên bản của Hội đồng chấm điểm luận văn đã được xác nhận";
        let formData = new FormData();
        formData.append("id", thesisData.id);
        formData.append("content", message);
        let result = await sendAuthPostResquest("/api/presentation/log", formData);
        if(result.status == 200) {
            dispatch(setPresentationGetLog(true));
        }
    }

    return (
    <>
        {data && data.submitted? <Stack direction={"column"} gap={2} alignItems="center" sx={{maxWidth: `1000px`, maxHeight: `3508px`, padding: `3%`, 
                                                                                                paddingTop: `30px`, mx: `auto`, overflow: `hidden`,
                                                                                                "@media print": {
                                                                                                    display: data && data.submitted? `block`: `none`,
                                                                                                }}}>
            {onProcess? <LinearProgress />: <></>}
            {!printable?data? !data.approved? data.submitted? <Alert sx={{width: {xs: `100%`, lg: `1000px`}}} severity="warning" action={
                                        <Button onClick={e => approve()} color="inherit" size="small">
                                            Xác nhận
                                        </Button>
                                    }>Biên bản của Hội đồng chấm điểm luận văn đã được gửi và đang chờ được xác nhận</Alert>: "": 
                                    <Alert sx={{width: `100%`}} severity="success"> Biên bản của Hội đồng chấm điểm luận văn đã được được xác nhận</Alert>: "":""}
            <Grid container sx={{width: `100%`}} >
                <Grid xs={6}>
                <Stack direction={"column"} sx={{width: `100%`}} alignItems={"center"}>
                    <Typography sx={{fontSize: `13pt`}}>TRƯỜNG ĐẠI HỌC CẦN THƠ</Typography>
                    <Typography sx={{fontSize: `13pt`, fontWeight: `bold`, textDecoration: `underline`}}>KHOA CNTT & TRUYỀN THÔNG</Typography>
                </Stack>
                </Grid>
                <Grid xs={6}>
                    <Stack direction={"column"} sx={{width: `100%`}} alignItems={"center"}>
                        <Typography sx={{fontSize: `13pt`, fontWeight: `bold`}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                        <Typography sx={{fontSize: `13pt`, fontWeight: `bold`, textDecoration: `underline`}}>Độc lập - Tự do - Hạnh phúc</Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Stack direction="column" sx={{width: `100%`}} alignItems={"center"}>
                <Typography sx={{fontSize: `14pt`, fontWeight: `bold`}}>BIÊN BẢN CỦA HỘI ĐỒNG</Typography>
                <Typography sx={{fontSize: `14pt`, fontWeight: `bold`}}>CHẤM BẢO VỆ LUẬN VĂN ĐẠI HỌC</Typography>
                <Typography sx={{fontSize: `14pt`, fontWeight: `bold`}}>Học kỳ:   
                <span sx={{width: `80px`, textAlign: `center`}}> {thesisData? thesisData.semester.semesterCode == "1"? "I": "II": ""}</span>    năm học   
                <span sx={{width: `80px`, textAlign: `center`}}> {thesisData? thesisData.semester.startYear + " - " + thesisData.semester.endYear: ""}</span> </Typography>
            </Stack>
            <Typography sx={{fontSize: `13pt`, fontWeight: `bold`, textAlign: "center"}}>Ngành: KỸ THUẬT PHẦN MỀM</Typography>
            <Stack direction={"column"} sx={{width: `100%`, marginTop: `20px`}}>
                <Typography sx={{fontSize: `13pt`}}>Họ tên sinh viên: {thesisData? thesisData.student.name: ""}</Typography>
                <Grid container sx={{width: `100%`}}>
                    <Grid xs={6}>
                        <Typography>MSSV: {thesisData? thesisData.student.studentCode: ""}</Typography>
                    </Grid>
                    <Grid xs={6}>
                        <Typography>Mã lớp: {thesisData? thesisData.student.classCode: ""} </Typography>
                    </Grid>
                </Grid>
                <Typography>Giáo viên hướng dẫn: {thesisData? thesisData.lecturer.name: ""}</Typography>
                <Typography>Tên đề tài: {thesisData? thesisData.topic.name: ""}</Typography>
                <Typography>Địa điểm bảo vệ: {thesisData?"Phòng " + thesisData.place: ""}</Typography>
                <Stack direction="row" gap={2} sx={{width: `100%`}}>
                    <Typography>Thời gian lúc:  {thesisData? thesisData.time: ""}</Typography>
                    <Typography>ngày  {thesisData? thesisData.dateArr[0]:""}</Typography>
                    <Typography>tháng  {thesisData? thesisData.dateArr[1]:""}</Typography>
                    <Typography>năm  {thesisData? thesisData.dateArr[2]:""}</Typography>
                </Stack>
            </Stack>
            <Stack direction="column" gap={1} sx={{width: `100%`}}>
                <Typography sx={{fontWeight: `bold`}}>1. Tuyên bố lý do:</Typography>
                <Typography> <input type="text" style={{width: `30px`, visibility: `hidden`}}></input>
                Căn cứ vào Quyết định số {otherThing[0]} /QĐ-CNTT&TT ngày {otherThing[1]} / {otherThing[2]} / {otherThing[3]} của Trưởng khoa 
                CNTT&TT, trường Đại học Cần Thơ về việc thành lập Hội đồng chấm Luận văn tốt nghiệp
                ngành/ chuyên ngành Kỹ thuật phần mềm . gồm các thành viên:
                </Typography>
                <Grid container sx={{width: `100%`, margin: ` 20px 10px 20px 10px`}}>
                    <Grid xs={4}><Typography>1. {thesisData? thesisData.president.title + ". " +  thesisData.president.name: ""}</Typography></Grid>
                    <Grid xs={5}><Typography>chủ tịch Hội đồng </Typography></Grid>
                    <Grid xs={4}><Typography>2. {thesisData? thesisData.secretary.title + ". " +  thesisData.secretary.name: ""}</Typography></Grid>
                    <Grid xs={5}><Typography>thư ký </Typography></Grid>
                    <Grid xs={4}><Typography>3. {thesisData? thesisData.member.title + ". " +  thesisData.member.name: ""}</Typography></Grid>
                    <Grid xs={5}><Typography>uỷ viên </Typography></Grid> 
                </Grid>
                <Typography sx={{fontWeight: `bold`}}>2. Chủ tịch Hội đồng, điều khiển buổi bảo vệ luận văn</Typography>
                <Typography><span style={{fontWeight: `bold`}}>2.1 Sinh viên:</span> trình bày luận văn</Typography>
                <Typography sx={{fontWeight: `bold`}}>2.2 Các câu hỏi của thành viên hội đồng và trả lời của sinh viên:</Typography>
                <Typography sx={{whiteSpace: `pre-wrap`}}>{qna}</Typography>
                <Typography sx={{fontWeight: `bold`}}>2.3. Góp ý của thành viên trong hội đồng:</Typography>
                <Typography sx={{whiteSpace: `pre-wrap`}}>{advices}</Typography>
                <Typography sx={{fontWeight: `bold`}}>2.4. Ý kiến nhận xét của người hướng dẫn:</Typography>
                <Typography sx={{whiteSpace: `pre-wrap`}}>{comment}</Typography>
                <Typography sx={{fontWeight: `bold`}}>2.5. Tổng hợp điểm của Hội đồng:</Typography>
                <Stack direction="column" gap={2} sx={{width: `100%`, marginLeft: `20px`, marginTop: `10px`}}  >
                    <Typography>Điểm số:</Typography>
                    <Stack sx={{width: `100%`}} alignItems={"center"}>
                        <TableContainer sx={{marginLeft: `calc(100% - 400px)`}}>
                        <Table sx={{ width: 400 }}>
                            <TableHead>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                                <TableCell align="center">Thành viên</TableCell>
                                <TableCell align="center">1</TableCell>
                                <TableCell align="center">2</TableCell>
                                <TableCell align="center">3</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                                >
                                <TableCell align="center">Điểm/10</TableCell>
                                <TableCell align="center">{presidentPoint}</TableCell>
                                <TableCell align="center">{memberPoint}</TableCell>
                                <TableCell align="center">{secretaryPoint}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Stack>
                </Stack>
                <Typography>
                    Trung bình: điểm số {totalPoint}/10, 
                    điểm chữ: {convertNumberMarkToLetterMark(totalPoint)}
                    </Typography>
                <Typography sx={{fontWeight: `bold`}}>2.6. Kết luận của Hội đồng:</Typography>
                <Typography sx={{paddingLeft: `20px`}}>Luận văn của sinh viên {presentationResult} .đạt (không đạt) yêu cầu.</Typography>
                <Typography sx={{paddingLeft: `20px`}}>Điểm: {finalPoint}</Typography>
                <Typography sx={{marginTop: `30px`}}>Hội đồng kết thúc vào lúc {endTime} cùng ngày.</Typography>
                <Grid container sx={{width: `100%`, marginTop: `30px`}}>
                    <Grid xs={5}>
                        <Stack direction="column" alignItems={"center"} sx={{width: `100%`}}>
                        <Typography sx={{visibility: `hidden`}}>Chủ tịch hội đồng</Typography>
                        <Typography>Chủ tịch hội đồng</Typography>
                        <Typography sx={{textAlign: `center` , marginTop: `70px`,width: `200px`, border: `none`, outline: `none`, fontSize: `13pt`}}>{thesisData? thesisData.president.name: ""}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={7}>
                        <Stack direction="column" alignItems={"center"} sx={{width: `100%`}}>
                        <Typography><i>Cần Thơ, ngày  {thesisData? thesisData.dateArr[0]:""} tháng  {thesisData? thesisData.dateArr[1]:""} năm  {thesisData? thesisData.dateArr[2]:""}</i></Typography>
                        <Typography>Thư ký hội đồng</Typography>
                        <Typography sx={{textAlign: `center` , marginTop: `70px`,width: `200px`, border: `none`, outline: `none`, fontSize: `13pt`}}>{thesisData? thesisData.secretary.name: ""}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>: <Alert sx={{width: {xs: `100%`, lg: `1000px`}, mx: `auto`,
                                                                                                "@media print": {
                                                                                                    display: data && data.submitted? `block`: `none`,
                                                                                                }}} severity="warning">Thư ký hội đồng chưa hoàn thành Biên bản của Hội đồng chấm điểm luận văn</Alert>}
    </>
    )
}

export default ReportForPrint;