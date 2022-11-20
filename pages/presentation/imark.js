import { Unstable_Grid2 as Grid, Typography, TextField } from "@mui/material";
import { Stack } from "@mui/system";


const IMark = () => {

    return (
        <Stack direction={"column"} gap={4} sx={{maxWidth: `800px`, padding: `3%`}}>
            <Stack direction={"column"} sx={{width: `100%`}} alignItems="center"> 
                <Typography sx={{fontWeight: `bold`}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>            
                <Typography sx={{fontWeight: `bold`, textDecoration: `underline`}}>Ðộc lập - Tự do - Hạnh phúc</Typography>            
            </Stack>
            <Typography sx={{textAlign: `center`, fontSize: `16pt`, fontWeight: `bold`, }}>ÐƠN XIN PHÉP VẮNG THI KẾT THÚC HỌC PHẦN</Typography>
            <Grid container sx={{width: `100%`, marginLeft: `50px`}}>
                <Grid xs={1.5}>
                    <Typography sx={{fontSize: `14pt`}}>Kính gửi:</Typography>
                </Grid>
                <Grid xs={10}>
                    <Typography sx={{fontSize: `14pt`}}><span style={{fontWeight: `bold`}}>- Quý Thầy/Cô giảng dạy học phần </span> 
                    <input type="text" style={{textAlign: `center` ,width: `42%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input></Typography>
                    <Typography sx={{fontSize: `14pt`}}><span style={{fontWeight: `bold`}}>- Ban Chủ nhiệm Khoa  </span>
                    <input type="text" style={{textAlign: `center` ,width: `60%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input></Typography>
                </Grid>
            </Grid>
            <Stack direction={"column"} gap={1} sx={{width: `100%`}}>
                <Typography>
                Tôi tên : 
                <input type="text" style={{textAlign: `center` ,width: `52%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                Mã số sinh viên:
                <input type="text" style={{textAlign: `center` ,width: `22%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                </Typography>
                <Typography>
                Ngày sinh  : 
                <input type="text" style={{textAlign: `center` ,width: `88%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                </Typography>
                <Typography>
                Ngành học  : 
                <input type="text" style={{textAlign: `center` ,width: `52%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                Khoá:
                <input type="text" style={{textAlign: `center` ,width: `12%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                (20<input type="text" style={{textAlign: `center` ,width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}/>
                - 20<input type="text" style={{textAlign: `center` ,width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}/>)
                </Typography>
                <Typography>
                Số điện thoại liên hệ:  
                <input type="text" style={{textAlign: `center` ,width: `78%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                </Typography>
                <Typography>
                <span style={{paddingLeft: `30px`}}>Tôi kính đơn này đến Ban Chủ nhiệm Khoa, Phòng Đào tạo và quý Thầy/Cô giảng </span>
                dạy học phần:<input type="text" style={{textAlign: `center` ,width: `60%`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}/> 
                Mã số HP: <input type="text" style={{textAlign: `center` ,width: `70px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}/>, 
                cho phép tôi không thi kết thúc học phần, được bảo lưu kết quả đánh giá giữa kỳ và nhận điểm I cho học phần này trong học kỳ
                <input type="text" style={{textAlign: `center` ,width: `70px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}/>, 
                 năm học: <input type="text" style={{textAlign: `center` ,width: `70px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}/>
                 Trong thời hạn 1 năm tiếp theo, tôi sẽ dự thi để hoàn tất điểm học phần. Nếu quá thời hạn trên, tôi không hoàn tất điểm học phần này thì điểm I sẽ được  
                 <b> chuyển thành điểm F</b>.  
                </Typography>
                <Grid container sx={{width: `100%`}}>
                    <Grid ><Typography sx={{marginLeft: `30px`}}>Lý do vắng thi:</Typography></Grid>
                    <Grid xs={9}>
                    <TextField color="secondary" multiline maxRows={15} fullWidth variant="standard"/>
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
                        <TextField color="secondary" multiline maxRows={15} fullWidth variant="standard"/>
                        </Stack>
                    </Grid>
                    <Grid xs={7}>
                        <Stack direction="column" alignItems={"center"} sx={{width: `100%`}}>
                        <Typography><i><input type="text" style={{textAlign: `center` , width: `80px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>,
                            ngày<input type="text" style={{textAlign: `center` , width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                            tháng 
                            <input type="text" style={{textAlign: `center` , width: `30px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                            năm <input type="text" style={{textAlign: `center` , width: `40px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input></i></Typography>
                        <Typography><b>Người viết đơn</b></Typography>
                        <input type="text" style={{textAlign: `center` , marginTop: `60px`,width: `200px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                        </Stack>
                    </Grid>
                </Grid>
                <Stack direction={"column"} sx={{width: `100%`}} alignItems="center">
                    <Typography><b>Ý kiến của Trưởng Khoa</b></Typography>
                    <TextField color="secondary" multiline maxRows={15} fullWidth variant="standard"/>
                </Stack>
        </Stack>
    )
}

export default IMark;