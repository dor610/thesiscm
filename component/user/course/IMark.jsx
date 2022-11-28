import { Unstable_Grid2 as Grid, Typography, TextField, Box } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { getData } from "../../../common/localStorage";
import { miliSecToDateOnly, sendAuthGetRequest } from "../../../common/utils";


const IMark = ({account, student, reason, setReason, lecturerComment, deanComment, setLecturerComment, setDeanComment, other, setOther,
                userData, setUserData, studentData, setStudentData}) => {

    const [semester, setSemester] = useState(null);

    useEffect(() => {
        if(student) {
            getStudentData();
        }
    }, [])

    useEffect(() => {
        getSemester();
    }, []);

    useEffect(() => {
        if(account) {
            setUserData(JSON.parse(getData("user")));
        }
    }, [])

    const getStudentData = async () =>{
        let result = await sendAuthGetRequest("/api/student?id=" + student);
        if (result.status == 200) {
            setStudentData(result.data);
        }
    }

    const onPhoneNumberChange = (value) => {
        let arr = [...other];
        arr[0] = value;
        setOther(arr);
    }

    const onDateChange = (value) =>{
        let arr = [...other];
        arr[1] = value;
        setOther(arr);
    }

    const onMonthChange = (value) => {
        let arr = [...other];
        arr[2] = value;
        setOther(arr);
    }

    const onYearChange = (value) => {
        let arr = [...other];
        arr[3] = value;
        setOther(arr);
    }

    const getSemester = async () =>{
        let result = await sendAuthGetRequest("/api/semester/current");
        if(result.status == 200) {
            setSemester(result.data);
        }
    }

    const generate = (studentCode) =>{
        let a = parseInt(studentCode.substring(1, 3));
        return `${(a - 18 + 44)} (20${a} - 20${a + 4})`
    }

    return (
    <Box sx={{width: `100%`, height: `100%`, overflow: `auto`}}>
        <Stack direction={"column"} gap={4} sx={{maxWidth: `750px`,padding: `3%`, mx:`auto`, paddingBottom: `100px`}}>
            <Stack direction={"column"} sx={{width: `100%`}} alignItems="center"> 
                <Typography sx={{fontWeight: `bold`}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>            
                <Typography sx={{fontWeight: `bold`, textDecoration: `underline`}}>Ðộc lập - Tự do - Hạnh phúc</Typography>            
            </Stack>
            <Typography sx={{textAlign: `center`, fontSize: `16pt`, fontWeight: `bold`, }}>ÐƠN XIN PHÉP VẮNG THI KẾT THÚC HỌC PHẦN</Typography>
            <Grid container sx={{width: `100%`, marginLeft: `50px`}}>
                <Grid xs={1.5}>
                    <Typography sx={{fontSize: `14pt`}}>Kính gửi:</Typography>
                </Grid>
                <Grid xs={7}>
                    <Typography sx={{fontSize: `14pt`}}><span style={{fontWeight: `bold`}}>- Quý Thầy/Cô giảng dạy học phần</span> </Typography>
                    <Typography sx={{fontSize: `14pt`}}><span style={{fontWeight: `bold`}}>  Luận văn tốt nghiệp ngành Kỹ thuật phần mềm</span> </Typography>
                    <Typography sx={{fontSize: `14pt`}}><span style={{fontWeight: `bold`}}>- Ban Chủ nhiệm Khoa Công nghệ phần mềm </span></Typography>
                </Grid>
            </Grid>
            <Stack direction={"column"} gap={1} sx={{width: `100%`}}>
                <Stack direction="row" sx={{width: `100%`}}>
                    <Typography sx={{width: `52%`}}>Tôi tên : {studentData? studentData.name: ""}</Typography>
                    <Typography sx={{width: `40%`}}>Mã số sinh viên: {studentData? studentData.studentCode: ""}</Typography>
                </Stack>
                <Typography>Ngày sinh : {studentData? miliSecToDateOnly(studentData.dateOfBirth): ""}</Typography>
                <Stack  direction="row" sx={{width: `100%`}}>
                    <Typography sx={{width: `52%`}}> Ngành học  : Kỹ thuật phần mềm </Typography>
                    <Typography> Khoá: {studentData? generate(studentData.studentCode):"(20  - 20   )"} </Typography>
                </Stack>
                <Typography>
                Số điện thoại liên hệ:  
                <input type="text" value={other[0]} onChange={e => onPhoneNumberChange(e.target.value)} style={{textAlign: `left` ,width: `65%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                </Typography>
                <Typography>
                <span style={{paddingLeft: `30px`}}>Tôi kính gửi đơn này đến Ban Chủ nhiệm Khoa, Phòng Đào tạo và quý Thầy/Cô giảng </span>
                dạy học phần: Luận văn tốt nghiệp ngành Kỹ thuật phần mềm. Mã số HP: CT594, cho phép tôi không thi kết thúc học phần, được bảo lưu kết quả đánh giá giữa kỳ 
                và nhận điểm I cho học phần này trong học kỳ {semester? semester.semesterCode == '1'? "I": "II": ""}, năm học: {semester? semester.startYear + " - " + semester.endYear + ". ": ""}
                 Trong thời hạn 1 năm tiếp theo, tôi sẽ dự thi để hoàn tất điểm học phần. Nếu quá thời hạn trên, tôi không hoàn tất điểm học phần này thì điểm I sẽ được  
                 <b> chuyển thành điểm F</b>.   
                </Typography>
                <Grid container sx={{width: `100%`}}>
                    <Grid ><Typography sx={{marginLeft: `30px`}}>Lý do vắng thi:</Typography></Grid>
                    <Grid xs={9}>
                    <TextField color="secondary" value={reason} onChange={e => setReason(e.target.value)} multiline maxRows={15} fullWidth variant="standard"/>
                    </Grid>
                </Grid>
                <Typography sx={{marginLeft: `30px`}}><i>(đính kèm giấy xác nhận minh chứng lý do).</i></Typography>
                <Typography sx={{marginLeft: `30px`}}>Kính mong được sự chấp thuận của quý Thầy, Cô</Typography>
                <Typography sx={{marginLeft: `30px`}}>Chân thành cảm ơn và kính chào trân trọng.</Typography>
            </Stack>
            <Grid container sx={{width: `100%`, marginTop: `30px`}}>
                    <Grid xs={5}>
                        <Stack direction="column" alignItems={"center"} sx={{width: `100%`}}>
                        <Typography sx={{visibility: `hidden`}}><b>Ý kiến CBGD </b></Typography>
                        <Typography><b>Ý kiến CBGD </b></Typography>
                        <TextField color="secondary" value={lecturerComment} onChange={e => setLecturerComment(e.target.value)} multiline maxRows={15} fullWidth variant="standard"/>
                        </Stack>
                    </Grid>
                    <Grid xs={7}>
                        <Stack direction="column" alignItems={"center"} sx={{width: `100%`}}>
                        <Typography><i>Cần Thơ ,
                            ngày <input type="text" value={other[1]} onChange={e => onDateChange(e.target.value)} style={{textAlign: `center` , width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                            tháng <input type="text" value={other[2]} onChange={e => onMonthChange(e.target.value)} style={{textAlign: `center` , width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                            năm <input type="text" value={other[3]} onChange={e => onYearChange(e.target.value)} style={{textAlign: `center` , width: `50px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input></i></Typography>
                        <Typography><b>Người viết đơn</b></Typography>
                        <span type="text" style={{textAlign: `center` , marginTop: `60px`,width: `200px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}>
                            {studentData? studentData.name: ""}
                        </span>
                        </Stack>
                    </Grid>
                </Grid>
                <Stack direction={"column"} sx={{width: `100%`}} alignItems="center">
                    <Typography><b>Ý kiến của Trưởng Khoa</b></Typography>
                    <TextField color="secondary" multiline value={deanComment} onChange={e => setDeanComment(e.target.value)} maxRows={15} fullWidth variant="standard"/>
                </Stack>
        </Stack>
    </Box>
    )
}

export default IMark;