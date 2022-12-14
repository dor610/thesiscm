
import { Edit, Print } from "@mui/icons-material";
import { Button, Divider, IconButton, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sendAuthGetRequest } from "../../common/utils";
import TableRow from "../../component/print/TableRow";

const PrintPage = () => {

    const router = useRouter();
    const { detail } = router.query;

    const [onProcess, setOnprocess] = useState(false);

    const [course, setCourse] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(detail) {
            getCourseData();
        }
    }, [detail]);

    const print = () => {
        window.print();
      }

    const getCourseData = async () => {
        setOnprocess(true);
        let res = await sendAuthGetRequest("/api/course?id=" + detail);
        if(res.status == 200) {
            setOnprocess(false);
            setCourse(res.data);
        } else {
            setOnprocess(false);
        }
    }

    const actions = [
        { icon: <Print />, name: 'In tài liệu', onClick: print},
     ];
    return (
        <>
        <Box sx={{width: `100%`, height: `50px`, py: `10px`, "@media print": {display: `none`}}}>
                <Paper>
                <Grid sx={{px:`20px`}} container>
                    <Grid xs={11}><Typography sx={{paddingLeft: `20px`}} variant="h6">In hoặc xuất tài liệu dưới dạng tệp tin PDF</Typography></Grid>
                    <Grid xs={1}>
                    <IconButton size="large" variant="contained" onClick={e => print()}><Print/></IconButton>
                    </Grid>
                </Grid>
                </Paper>
            </Box>
        <Stack direction="column" sx={{width: `750px`, mx: `auto`, paddingTop: `50px`, "@media print": {paddingTop: `0px`}}}>
            
            <Grid container sx={{width: `100%`}}>
                <Grid xs={6}>
                    <Stack direction={"row"}>
                        <Box sx={{width: `25%`, height: `70px`, position: `relative`}}>
                            <Image src={"https://www.dropbox.com/s/miofvlbbknu50r4/0305-logo-ctu.png?raw=1"} layout="fill" objectFit="contain" alt="" />
                        </Box>
                        <Stack direction="column" alignItems={"center"} justifyContent="center">
                            <Typography>TRƯỜNG ĐẠI HỌC CẦN THƠ</Typography>
                            <Typography sx={{fontWeight: `bold`}}>TRƯỜNG CÔNG NGHỆ THÔNG TIN</Typography>
                            <Typography sx={{fontWeight: `bold`, borderBottom: `1px solid black`, paddingBottom: `5px`}}>& TRUYỀN THÔNG</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid xs={6}>
                    <Stack direction={"column"} alignItems="center" justifyContent={"center"}>
                        <Typography><br/></Typography>
                        <Typography sx={{fontWeight: `bold`}}>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                        <Typography sx={{fontWeight: `bold`, borderBottom: `1px solid black`, paddingBottom: `5px`}}>Độc Lập - Tự Do - Hạnh Phúc</Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Stack direction={"column"} alignItems="center" justifyContent={"center"} sx={{paddingTop: `15px`}}>
                <Typography sx={{fontWeight: `bold`}}>BẢNG TỔNG HỢP ĐIỂM THI</Typography>
                <Typography>Học Kỳ {"1"} - Năm Học {"2021 - 2022"}</Typography>
            </Stack>
            <Grid container>
                <Grid xs={2.2}>
                    <Typography>Học phần/Nhóm</Typography>
                    <Typography>Ngày thi</Typography>
                </Grid>
                <Grid xs={7.8}>
                    <Typography style={{fontWeight: `bold`}}>Luận văn tốt nghiệp - KTPM (CT594) - Nhóm {"05"}</Typography>
                    <Typography> /<span style={{visibility: `hidden`}}>{"ngày"}</span>/  </Typography>
                </Grid>
                <Grid xs={2}>
                    <Typography>Số tính chỉ: 10</Typography>
                    <Typography>Phòng thi</Typography>
                </Grid>
            </Grid>
            <Typography sx={{textAlign: "right"}}>Trang 1</Typography>
            <Box sx={{width: `100%`, border: `1px solid black`}}> 
                <Grid container sx={{width: `100%`}}>
                    <Grid xs={0.7}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>STT</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={1.3}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>Mã sinh viên</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={5.5}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>Họ và tên</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={1.5}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>Ngày sinh</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={1.5}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>Tên lớp</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={0.7}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>Điểm 10</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={0.8}><Stack sx={{width: `100%`, height: `100%`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>Điểm chữ</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                {course? course.students.map((data, index) => {
                    return <TableRow key={Math.random() + "_" + Math.random()} no={index + 1} semester={course.semester} studentCode={data} />
                }): <></>}
            </Box>  
            <Grid container>
                <Grid xs={6}>
                    <Stack direction={"column"} alignItems="center" justifyContent={"center"}>
                        <Typography><br/></Typography>
                        <Typography sx={{fontWeight: `bold`}}>CÁN BỘ NHẬP ĐIỂM</Typography>
                        <Typography><br/><br/><br/></Typography>
                        <Typography sx={{fontWeight: `bold`}}>{course? course.lecturer.name:"Tên cán bộ"}</Typography>
                    </Stack>
                </Grid>
                <Grid xs={6}>
                    <Stack direction={"column"} alignItems="center" justifyContent={"center"}>
                        <Typography>Ngày {(new Date()).getDate()} Tháng {(new Date()).getMonth() + 1} Năm {(new Date()).getFullYear()}</Typography>
                        <Typography sx={{fontWeight: `bold`}}>THỦ TRƯỞNG ĐƠN VỊ</Typography>
                        <Typography><br/><br/></Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Stack></>
    )

}

export default PrintPage; 