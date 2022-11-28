import { Save, Send } from "@mui/icons-material";
import { Alert, BottomNavigation, BottomNavigationAction, Button, Divider, LinearProgress, MenuItem, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../common/toastify";
import { convertNumberMarkToLetterMark, sendAuthGetRequest, sendAuthPostResquest } from "../../common/utils";
import { setPresentationGetLog, setPresentationReloadReport, setPresentationReportApproved } from "../../features/presentationSlice";

const Report = ({thesisData}) =>{
    const account = useSelector(state => state.user.account);
    const dispatch = useDispatch();
    const isReloadReport = useSelector(state => state.presentation.reloadReport);
    const isReportApproved = useSelector(state => state.presentation.isReportApproved);

    const [qna, setQna] = useState("");
    const [advices, setAdvices] = useState("");
    const [comment, setComment] = useState("");
    const [presentationResult, setPresentationResult] = useState("");
    const [otherThing, setOtherThing] = useState(["", "", "", ""]);
    const [endTime, setEndTime] = useState("");
    const [data, setData] = useState(null);

    const [presidentPoint, setPresidentPoint] = useState(0);
    const [secretaryPoint, setSecretaryPoint] = useState(0);
    const [memberPoint, setMemberPoint] = useState(0);
    const [totalPoint, setTotalPoint] = useState(0);

    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [onProcess, setOnProcess] = useState(false);

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
        if(thesisData) {
            if(account == thesisData.president.account){
                setUserData({...thesisData.president});
            }
            if(account == thesisData.secretary.account){
                setUserData({...thesisData.secretary});
            }
            if(account == thesisData.member.account){
                setUserData({...thesisData.member});
            }
        }
    }, [thesisData])

    useEffect(() => {
        setTotalPoint(Math.round((((presidentPoint + secretaryPoint + memberPoint)/3) + Number.EPSILON) * 100) / 100);
    }, [presidentPoint, secretaryPoint, memberPoint]);

    const getData = async () => { 
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/report/presentaion?id="+thesisData.id);
        console.log(result);
        if(result.status == 200) {
            let tData = result.data;
            console.log(tData);
            setQna(tData.qna);
            setAdvices(tData.advices);
            setComment(tData.comment);
            setPresentationResult(tData.result);
            setTotalPoint(tData.finalPoint);
            setEndTime(tData.endTime);
            setOtherThing(tData.other.split(","));
            setData(tData);
            setOnProcess(false);
            getPoint();
            dispatch(setPresentationReloadReport(false));
            if(tData.approved) {
                dispatch(setPresentationReportApproved(true));
            }else{
                dispatch(setPresentationReportApproved(false));
            }
        } else {
            
            dispatch(setPresentationReportApproved(false));
            dispatch(setPresentationReloadReport(false));
            setOnProcess(false);
        }
    }

    const getPoint = async () =>{
        let result = await sendAuthGetRequest("/api/point/report?id="+thesisData.id);
        console.log(result);
        if(result.status == 200) {
            result.data.forEach(element => {
                if(element.creator.account == thesisData.president.account){
                    let point = Math.round(((element.aTotalPoint + element.bTotalPoint + element.cTotalPoint) + Number.EPSILON) * 100) / 100;
                    setPresidentPoint(point);
                }
                if(element.creator.account == thesisData.secretary.account){
                    let point = Math.round(((element.aTotalPoint + element.bTotalPoint + element.cTotalPoint) + Number.EPSILON) * 100) / 100;
                    setSecretaryPoint(point);
                }
                if(element.creator.account == thesisData.member.account){
                    let point = Math.round(((element.aTotalPoint + element.bTotalPoint + element.cTotalPoint) + Number.EPSILON) * 100) / 100;
                    setMemberPoint(point);
                }
            });
        }
    }

    const submit = async () => {
        setOnProcess(true);
        let data = new FormData();
        data.append("qna", qna);
        data.append("advices", advices);
        data.append("comment", comment);
        data.append("result", presentationResult);
        data.append("finalPoint", totalPoint);
        data.append("presentation", thesisData.id);
        data.append("student", thesisData.student.id);
        data.append("account", account);
        data.append("other", otherThing.join(","));
        data.append("endTime", endTime);
        let result = await sendAuthPostResquest("/api/report/submit", data);
        if(result.status == 200) {
            setOnProcess(false);
            successNotify("Gửi đi thành công"); 
            writeLogOnSubmit();
        } else {
            setOnProcess(false);
            errorNotify("Đã có lỗi xảy ra, vui lòng thử lại");
        }
    }

    const writeLogOnSubmit = async () => {
        console.log(data);
        let message = data? data.submitted? userData.name + " đã chỉnh sửa Biên bảng chấm điểm luận văn.": userData.name + " đã gửi Biên bảng chấm điểm luận văn.": userData.name + " đã gửi Biên bảng chấm điểm luận văn.";
        let formData = new FormData();
        formData.append("id", thesisData.id);
        formData.append("content", message);
        let result = await sendAuthPostResquest("/api/presentation/log", formData);
        if(result.status == 200) {
            dispatch(setPresentationGetLog(true));
        }
    }

    const save = async () => {
        let data = new FormData();
        data.append("qna", qna);
        data.append("advices", advices);
        data.append("comment", comment);
        data.append("result", presentationResult);
        data.append("finalPoint", totalPoint);
        data.append("presentation", thesisData.id);
        data.append("account", account);
        data.append("endTime", endTime);
        data.append("student", thesisData.student.id);
        data.append("other", otherThing.join(","));
        let result = await sendAuthPostResquest("/api/report/save", data);
        if(result.status == 200) {
            successNotify("Lưu thông tin thành công");
        } else {
            errorNotify("Lưu thông tin thất bại, vui lòng thử lại");
        }
    } 

    const onOtherChange = (value, index) => {
        let arr = [...otherThing];
        arr[index] = value;
        setOtherThing(arr);
    }

    
    const actions = [
        { icon: <Send />, name: 'Gửi đến chủ tịch hội đồng', onClick: submit},
        { icon: <Save />, name: 'Lưu thông tin', onClick: save },
      ];

    return (
        <Stack direction={"column"} gap={2} alignItems="center" sx={{maxWidth: `1000px`, maxHeight: `3508px`, mx: `auto`, overflow: `hidden`}}>
            {onProcess? <LinearProgress />: <></>}
            {success? <Alert sx={{width: `100%`}} severity="success">{message}</Alert>: <></>}
            {error? <Alert sx={{width: `100%`}} severity="error">{message}</Alert>: <></>}
            {data? data.approved? <Alert sx={{width: `100%`}} severity="success">Biên bản đã được xác nhận bởi chủ tịch hội đồng</Alert>: 
            <Alert sx={{width: `100%`}} severity="warning">{data.isSubmitted? "Biên bản đang chờ xác nhận từ chủ tịch hội đồng" : "Biên bản chưa được xác nhận bởi chủ tịch hội đồng"}</Alert>: <></>}
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
                Căn cứ vào Quyết định số <input type="text" value={otherThing[0]} onChange={e => onOtherChange(e.target.value, 0)} style={{textAlign: `center` ,width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input> /QĐ-CNTT&TT ngày
                <input type="text" value={otherThing[1]} onChange={e => onOtherChange(e.target.value, 1)} style={{textAlign: `center` ,width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input> 
                 /<input type="text" value={otherThing[2]} onChange={e => onOtherChange(e.target.value, 2)} style={{textAlign: `center` ,width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input> 
                 /<input type="text" value={otherThing[3]} onChange={e => onOtherChange(e.target.value, 3)} style={{textAlign: `center` ,width: `50px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input> 
                 của Trưởng khoa 
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
                <TextField color="secondary" value={qna} onChange={e => setQna(e.target.value)} multiline fullWidth variant="standard"/>
                <Typography sx={{fontWeight: `bold`}}>2.3. Góp ý của thành viên trong hội đồng:</Typography>
                <TextField color="secondary" value={advices} onChange={e => setAdvices(e.target.value)} multiline fullWidth variant="standard"/>
                <Typography sx={{fontWeight: `bold`}}>2.4. Ý kiến nhận xét của người hướng dẫn:</Typography>
                <TextField color="secondary" value={comment} onChange={e => setComment(e.target.value)} multiline fullWidth variant="standard"/>
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
                <Stack direction="row">
                <Typography sx={{paddingLeft: `20px`}}>Luận văn của sinh viên {thesisData? thesisData.student.name: ""} . </Typography>
                <TextField component={'span'} variant="standard" sx={{width: `100px`, textAlign: `center`}} value={presentationResult} onChange={e => setPresentationResult(e.target.value)} select>
                    <MenuItem component={'span'} value={"đạt"}>đạt</MenuItem>
                    <MenuItem component={'span'} value={"không đạt"}>không đạt</MenuItem>
                </TextField>
                <Typography> yêu cầu.
                </Typography>
                </Stack>
                <Typography sx={{paddingLeft: `20px`}}>Điểm: {totalPoint}</Typography>
                <Typography sx={{marginTop: `30px`}}>Hội đồng kết thúc vào lúc <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} style={{textAlign: `center` ,width: `200px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>cùng ngày.</Typography>
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
            {!isReportApproved?<SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'fixed', bottom: `5%`, right: `3%` }}
                icon={<SpeedDialIcon />}
                open={open}
                onOpen={e => setOpen(true)}
                onClose={e => setOpen(false)}
                hidden={data && data.approved}
            >
                {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={e => {action.onClick(); setOpen(false)}}
                />
                ))}
            </SpeedDial>:<></>}
        </Stack>
    )
}

export default Report;