import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Divider, MenuItem, Paper, Skeleton, TextField, Typography, Unstable_Grid2 as Grid } from "@mui/material"
import { Stack } from "@mui/system"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { setData } from "../../common/localStorage"
import { convertNumberMarkToLetterMark, sendAuthGetRequest } from "../../common/utils"

const PointSheetForPrint = ({user , thesisData}) => {

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [onProcess, setOnProcess] = useState(false);


    const [sample, setSample] = useState(null);
    //có thể truyền as props
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [aPoint, setAPoint] = useState({});
    const [aTotalPoint, setATotalPoint] = useState(0.0);
    const [bPoint, setBPoint] = useState({});
    const [bTotalPoint, setBTotalPoint] = useState(0.0);
    const [cPoint, setCPoint] = useState({});
    const [cTotalPoint, setCTotalPoint] = useState(0.0);
    const [totalPoint, setTotalPoint] = useState(0.0);

    useEffect(() => {
        getSample();
    }, []);

    useEffect(() => {
        if(user && thesisData){
            if(user == thesisData.president.account)
                setUserData(thesisData.president);
            if(user == thesisData.secretary.account)
                setUserData(thesisData.secretary)
            if(user == thesisData.member.account)
                setUserData(thesisData.member)
        }
    }, [user, thesisData])

    useEffect(() => {
        if(user && thesisData) {
            getData();
        }
    }, [user, thesisData])

    const getSample  = async () => {
        let result = await sendAuthGetRequest("/api/sample");
        if(result.status == 200) {
            let aList = {};
            let bList = {};
            let cList = {};
            Object.keys(result.data.adata).forEach(key => {
                aList[key] = 0.55;
            })
            Object.keys(result.data.bdata).forEach(key => {
                bList[key] = 0.55;
            })
            Object.keys(result.data.cdata).forEach(key => {
                cList[key] = 0.55;
            })
            setAPoint(aList);
            setBPoint(bList);
            setCPoint(cList);
            setSample(result.data);
        } else{ 
            //handle error
        }
    }

    const getData = async () => {
        let result = await sendAuthGetRequest("/api/point/user?account="+user+"&presentation="+thesisData.id);
        console.log(thesisData.id);
        if(result.status == 200 && result.data) {
            let tData = {
                ... result.data,
                aPoint: JSON.parse(result.data.aPoint),
                bPoint: JSON.parse(result.data.bPoint),
                cPoint: JSON.parse(result.data.cPoint)
            }
            console.log(tData);
            setAPoint(tData.aPoint);
            setBPoint(tData.bPoint);
            setCPoint(tData.cPoint);
            setATotalPoint(tData.aTotalPoint);
            setBTotalPoint(tData.bTotalPoint);
            setCTotalPoint(tData.cTotalPoint);
            setTotalPoint(Math.round(((tData.aTotalPoint + tData.bTotalPoint + tData.cTotalPoint) + Number.EPSILON) * 100) / 100);
            setData(tData);
        }

    }

    const generateSelectOption = (list, pointList, setPointList) => {
        let arr = [];
        let resultList = [];
        Object.keys(list).forEach(key => {
            let criteria = list[key];
            let value = "";
            let point = 0;
            criteria.data.forEach(x => {
                if(x.value == pointList[key]){
                    value = x.label;
                    point = Math.round(((pointList[key] * criteria.weight) + Number.EPSILON) * 100) / 100;
                }
            })
            arr.push({
                label: key,
                value: value,
                point: point,
            })
        });    
        arr.forEach(x => {
            resultList.push(
            <Box key={"option_"+x.label+Math.random()} sx={{width: `100%`, py: `5px`}}>
                <Divider/>
                <Grid container>
                    <Grid xs={5.5}>
                        <Typography sx={{fontSize: `13pt`, fontWeight: `bold`}}>{x.label}</Typography>
                    </Grid>
                    <Grid xs={4.5}>
                        <Typography sx={{fontSize: `13pt`}}>{x.value}</Typography>
                    </Grid>
                    <Grid xs={1.5}>
                            <Typography sx={{textAlign: "center", padding: {xs: `20px`, md: 0}, textAlign: `center`, mx: `auto`,}}>
                                {x.point}
                            </Typography>
                    </Grid>
                </Grid>
            </Box>
            )
        })

        return resultList;
    }

    return (
        <>
        <Stack direction="column" sx={{width: `800px`, mx: `auto`, paddingTop: `20px`,
                                        "@media print": {
                                            maxWidth: `100%`,
                                            width: `100%`,
                                        }}} >
            {data? <></>: <Box sx={{width: {xs: `100%`}, mx: `auto`, p: `20px`, '@media print': {display: `none`}}}>
            <Alert severity="warning">{
                userData? userData.title + ". " + userData.name +" chưa xác nhận bảng điểm": "Đã có lỗi xảy ra"
                }</Alert>
        </Box>}
            <Stack direction={"column"} sx={{width: `100%`, paddingBottom: `20px`}} alignItems="center">
                <Typography sx={{fontSize: `15pt`, fontWeight: `bold`}}>PHIẾU ĐÁNH GIÁ LUẬN VĂN TỐT NGHIỆP</Typography>
                <Typography sx={{fontSize: `15pt`, fontWeight: `bold`}}>Ngành: KỸ THUẬT PHẦN MỀM</Typography>
                <Typography sx={{}}>Học kỳ: {thesisData && thesisData.semester.semesterCode == "1"? "I": "II"}, 
                Năm học: {thesisData? thesisData.semester.startYear: ""} - {thesisData? thesisData.semester.endYear: ""}</Typography>
            </Stack>
            <Paper elevation={2} sx={{padding: `20px`}}>
            <Grid container sx={{width: `100%`, paddingTop: `10px`}} gap={1}>
                <Grid xs={12}><Typography variant="h6">{thesisData? thesisData.topic.name: ""}</Typography></Grid>
                <Grid xs={12}><Typography>Thời gian và địa điểm: {thesisData? thesisData.time + ", phòng " + thesisData.place: ""}</Typography></Grid>
                <Grid container sx={{width: `100%`}}>
                    <Grid container xs={12} md={6} sx={{width: `100%`}}>
                        <Stack direction={"column"}sx={{width: `100%`}} gap={1}>
                            <Typography>Họ tên sinh viên: {thesisData? thesisData.student.name: ""}</Typography>
                            <Typography>MSSV: {thesisData? thesisData.student.studentCode: ""}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}> 
                        <Stack direction={"column"}sx={{width: `100%`}} gap={1}>
                            <Typography>Người đánh giá: {userData? userData.name: ""}</Typography>
                            <Typography>MSGV: {userData? userData.account: ""}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            </Paper>
            <Stack direction={"column"} gap={2} sx={{width: `100%`, marginTop: `20px`}} >
                {sample == null? <Skeleton variant="rounded" width={210} height={60} />:
                <>
              <Stack direction={"row"} sx={{width: `100%`, gap: `2%`}} alignItems="center">
                <Paper elevation={2} sx={{width: `calc(49%)`, textAlign: `center`, padding: `5px`}}>
                    <Typography variant="h6">Điểm số</Typography>
                    <Divider/>
                    <Typography variant="h6">{totalPoint}</Typography>
                </Paper>
                <Paper elevation={2} sx={{width: `calc(49%)`, textAlign: `center`, padding: `5px`}}>
                    <Typography variant="h6">Điểm chữ</Typography>
                    <Divider/>
                    <Typography variant="h6">{convertNumberMarkToLetterMark(totalPoint)}</Typography>
                </Paper>
              </Stack>
                    <Typography sx={{fontWeight: `bold`}}>{sample.alabel}</Typography>
                    <Stack direction={"column"} sx={{width: `100%`}}>
                            {generateSelectOption(sample.adata, aPoint, setAPoint)}
                        <Divider/>
                    </Stack>
                    <Grid container sx={{width: `100%`}} alignItems="center">
                        <Grid xs={10}>
                            <Typography variant="h6">Điểm </Typography>
                        </Grid>
                        <Grid xs={2}>
                            <Typography variant="h6" sx={{textAlign: "center"}}>{aTotalPoint}</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{width: `100%`, height: `30px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
                    <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                        <Divider  />
                    </Stack>
                    <Typography sx={{fontWeight: `bold`}}>{sample.blabel}</Typography>
                        <Stack direction={"column"} sx={{width: `100%`}}>
                            {generateSelectOption(sample.bdata, bPoint, setBPoint)}
                            <Divider/>
                        </Stack>
                        <Grid container sx={{width: `100%`}} alignItems="center">
                            <Grid xs={10}>
                                <Typography variant="h6">Điểm </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h6" sx={{textAlign: "center"}}>{bTotalPoint}</Typography>
                            </Grid>
                        </Grid>

                    <Box sx={{width: `100%`, height: `150px`, "@media print": {display: `block`}, "@media screen": {display: `none`}}}></Box>
                    <Stack direction={"column"} justifyContent={"center"} sx={{width: `100%`, height: `100px`, "@media print": {display: `none`}}}>
                        <Divider  />
                    </Stack>
                    <Typography sx={{fontWeight: `bold`}}>{sample.clabel}</Typography>
                        <Stack direction={"column"} sx={{width: `100%`}}>
                        {generateSelectOption(sample.cdata, cPoint, setCPoint)}
                        <Divider/>
                        </Stack>
                        <Grid container sx={{width: `100%`}} alignItems="center">
                            <Grid xs={10}>
                                <Typography variant="h6">Điểm </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h6" sx={{textAlign: "center"}}>{cTotalPoint}</Typography>
                            </Grid>
                     </Grid>
                </>
                }
                <Grid container sx={{width: `100%`, marginTop: `30px`}}>
                    <Grid xs={5}>
                        
                    </Grid>
                    <Grid xs={7}>
                        <Stack direction="column" alignItems={"center"} sx={{width: `100%`}}>
                        <Typography><i>Cần Thơ, ngày<input type="text" style={{textAlign: `center` , width: `50px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                            tháng 
                            <input type="text" style={{textAlign: `center` , width: `50px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input>
                            năm <input type="text" style={{textAlign: `center` , width: `50px`, border: `none`, outline: `none`, borderBottom: `1px dashed black`, fontSize: `13pt`}}></input></i></Typography>
                        <Typography>Thành viên hội đồng</Typography>
                        <Typography sx={{textAlign: `center` , marginTop: `50px`,width: `200px`, fontSize: `13pt`}}>{userData? userData.name: ""}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
            
        </Stack> </>
    )
}

export default PointSheetForPrint;