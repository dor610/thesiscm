import { Edit, Replay, Save, Send } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, LinearProgress, MenuItem, Paper, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Tooltip, Typography, Unstable_Grid2 as Grid } from "@mui/material"
import { Stack } from "@mui/system"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { errorNotify, successNotify } from "../../common/toastify"
import { convertNumberMarkToLetterMark, sendAuthGetRequest, sendAuthPostResquest, sendPostRequest } from "../../common/utils"
import { setPresentationGetLog } from "../../features/presentationSlice"

const PointSheet = ({thesisData}) => {

    const account = useSelector(state => state.user.account);
    const isReportApproved = useSelector(state => state.presentation.isReportApproved)
    const dispatch = useDispatch();

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [onProcess, setOnProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(false);

    const [userData, setUserData] = useState(null);
    const [sample, setSample] = useState(null);
    const [data, setData] = useState(null);
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
        if(sample && aPoint && bPoint && cPoint){
            processPoint();
        }
    }, [aPoint, bPoint, cPoint, sample]);

    useEffect(() => {
        if(account && thesisData && sample) {
            getData();
        }
    }, [account, thesisData, sample]);

    useEffect(() => {
        if(reload)
            getData();
    }, [reload]);

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

    const getSample  = async () => {
        setOnProcess(true);
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
            setOnProcess(false);
        } else{ 
            setOnProcess(false);
            //handle error
        }
    }

    const getData = async () => {
        let result = await sendAuthGetRequest("/api/point/user?account="+account+"&presentation="+thesisData.id);
        if(result.status == 200 && result.data) {
            let tData = {
                ... result.data,
                aPoint: JSON.parse(result.data.aPoint),
                bPoint: JSON.parse(result.data.bPoint),
                cPoint: JSON.parse(result.data.cPoint)
            }
            setAPoint(tData.aPoint);
            setBPoint(tData.bPoint);
            setCPoint(tData.cPoint);
            setATotalPoint(tData.aTotalPoint);
            setBTotalPoint(tData.bTotalPoint);
            setCTotalPoint(tData.cTotalPoint);
            setData(tData);
        }

    }

    const onPointChange = (event, pointList, setPointList) =>{
        if(event.target.value != "") {
            let dataList = {...pointList};
            dataList[event.target.name] = event.target.value;
            setPointList(dataList);
        }
    }

    const generateSelectOption = (list, pointList, setPointList) => {
        let arr = [];    
        Object.keys(list).forEach(key => {
            arr.push(<Grid container key={"option_"+key+Math.random()} sx={{width: `100%`}} alignItems="center">
            <Grid xs={12} md={11}>
            <TextField
                name={key}
                color="secondary"
                variant="standard"
                label={key}
                value={pointList[key]}
                onChange = {(e) => onPointChange(e, pointList, setPointList)}
                select
                fullWidth
                >
                {list[key].data.map((option) => (
                    <MenuItem sx={{whiteSpace: 'normal'}} key={option.value} title={option.label} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
                </TextField>
            </Grid>
            <Grid xs={12} md={1}>
                    <Typography sx={{textAlign: "center", padding: {xs: `20px`, md: 0}, textAlign: `center`, mx: `auto`,
                                    borderBottom: {xs: `1px solid gray`, md: `none`}, width: {xs: `50%`, md: `100%`}
                }}>{pointList[key]? Math.round(((pointList[key] * list[key].weight) + Number.EPSILON) * 100) / 100 : "0.0"}</Typography>
            </Grid>
        </Grid>)
        })

        return arr;
    }

    const save = async () => {
        setOnProcess(true);
        let formData = new FormData();
        formData.append("aPoint", JSON.stringify(aPoint));
        formData.append("bPoint", JSON.stringify(bPoint));
        formData.append("cPoint", JSON.stringify(cPoint));
        formData.append("aTotalPoint", aTotalPoint);
        formData.append("bTotalPoint", bTotalPoint);
        formData.append("cTotalPoint", cTotalPoint);
        formData.append("sample", sample.id);
        formData.append("presentation", thesisData.id);
        formData.append("account", account);
        let result = await sendPostRequest("/api/point/save", formData);
        if(result.status == 200 && result.data) {
            successNotify("Lưu bảng điểm thành công")
            setOnProcess(false);
        } else {
            errorNotify("Có lỗi xảy ra, vui lòng thực hiện lại");
            setOnProcess(false);
        }
    }

    const submit = async () => {
        setOnProcess(true);
        let formData = new FormData();
        formData.append("aPoint", JSON.stringify(aPoint));
        formData.append("bPoint", JSON.stringify(bPoint));
        formData.append("cPoint", JSON.stringify(cPoint));
        formData.append("aTotalPoint", aTotalPoint);
        formData.append("bTotalPoint", bTotalPoint);
        formData.append("cTotalPoint", cTotalPoint);
        formData.append("sample", sample.id);
        formData.append("presentation", thesisData.id);
        formData.append("account", account);
        let result = await sendPostRequest("/api/point/submit", formData);
        if(result.status == 200 && result.data) {
            successNotify("Bảng điểm đã được xác nhận lưu thành công")
            setOnProcess(false);
            console.log("hihi");
            writeLogOnSubmit();
        } else {
            errorNotify("Có lỗi xảy ra, vui lòng thực hiện lại");
            setOnProcess(false);
        }
    }

    const writeLogOnSubmit = async () => {
        let message =  (data && data.submitted)? userData.name + " đã chỉnh sửa bảng điểm của mình.": userData.name + " đã xác nhận bảng điểm của mình.";
        let formData = new FormData();
        formData.append("id", thesisData.id);
        formData.append("content", message);
        let result = await sendAuthPostResquest("/api/presentation/log", formData);
        console.log(result);
        if(result.status == 200) {
            dispatch(setPresentationGetLog(true));
        }
    }

    const actions = [
        { icon: <Send />, name: 'Xác nhận bảng điểm cuối cùng', onClick: submit },
        { icon: <Save />, name: 'Lưu bảng điểm', onClick: save },
      ];

    const processPoint = () =>{
        let result = 0;
        let aActualPoint = 0.0;
        let bActualPoint = 0.0;
        let cActualPoint = 0.0;
        Object.keys(aPoint).forEach(key => {
            aActualPoint += aPoint[key]*sample.adata[key].weight;
        });
        Object.keys(bPoint).forEach(key => {
           bActualPoint += bPoint[key]*sample.bdata[key].weight;
        });
        Object.keys(cPoint).forEach(key => {
            cActualPoint += cPoint[key]*sample.cdata[key].weight;
        });

        
        result = aActualPoint + bActualPoint + cActualPoint;
        setATotalPoint(Math.round((aActualPoint + Number.EPSILON) * 100) / 100);
        setBTotalPoint(Math.round((bActualPoint + Number.EPSILON) * 100) / 100);
        setCTotalPoint(Math.round((cActualPoint + Number.EPSILON) * 100) / 100);
        setTotalPoint(Math.round((result + Number.EPSILON) * 100) / 100);
    }

    const initialPoint = (aActualPoint, bActualPoint, cActualPoint) =>{
        let result = aActualPoint + bActualPoint + cActualPoint;
        console.log(aActualPoint + "   " +bActualPoint + "   " +cActualPoint +"   " + result);
        setATotalPoint(Math.round((aActualPoint + Number.EPSILON) * 100) / 100);
        setBTotalPoint(Math.round((bActualPoint + Number.EPSILON) * 100) / 100);
        setCTotalPoint(Math.round((cActualPoint + Number.EPSILON) * 100) / 100);
        setTotalPoint(Math.round((result + Number.EPSILON) * 100) / 100);
    }

    return (
 
        <Stack direction="column" sx={{width: {xs: `100%`, lg: `1000px`}, padding: `5px`, py: `30px`, mx: `auto`}} >
            {onProcess? <LinearProgress />: <></>}
            <Stack direction={"column"} sx={{width: `100%`, paddingTop: `20px`, paddingBottom: `20px`}} alignItems="center">
                <Typography sx={{fontSize: `15pt`, fontWeight: `bold`}}>PHIẾU ĐÁNH GIÁ LUẬN VĂN TỐT NGHIỆP</Typography>
                <Typography sx={{fontSize: `15pt`, fontWeight: `bold`}}>Ngành: KỸ THUẬT PHẦN MỀM</Typography>
                <Typography sx={{}}>Học kỳ: {thesisData && thesisData.semester.semesterCode == "1"? "I": "II"}, 
                Năm học:{thesisData? thesisData.semester.startYear: ""} - {thesisData? thesisData.semester.endYear: ""}</Typography>
            </Stack>
            <Paper elevation={2} sx={{padding: `20px`}}>
            <Grid container gap={1} sx={{width: `100%`, paddingTop: `10px`, pageBreakBefore: `always`}}>
                <Grid xs={12}><Typography variant="h5">{thesisData? thesisData.topic.name: ""}</Typography></Grid>
                <Grid xs={12}><Typography>Thời gian và địa điểm: {thesisData? thesisData.time + ", phòng " + thesisData.place: ""}</Typography></Grid>
                <Grid container sx={{width: `100%`}}>
                    <Grid container xs={12} md={6} sx={{width: `100%`}}>
                        <Stack direction={"column"}sx={{width: `100%`}}>
                            <Typography>MSSV: {thesisData? thesisData.student.studentCode: ""}</Typography>
                            <Typography>Họ tên sinh viên: {thesisData? thesisData.student.name: ""}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={6}> 
                        <Stack direction={"column"}sx={{width: `100%`}}>
                            <Typography>MSGV: {account}</Typography>
                            <Typography>Người đánh giá: {userData? userData.name:""}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            </Paper>
            <Stack direction={"column"} gap={2} sx={{width: `100%`, marginTop: `20px`}} >
                {sample == null? <Skeleton variant="rounded" width={210} height={60} />:
                <>
              <Stack direction={{xs: `column`, md: "row"}} sx={{width: `100%`}} gap={2} alignItems="center">
                <Paper elevation={2} sx={{width: {xs: `100%`, md: `49%`}, textAlign: `center`, padding: `5px`}}>
                    <Typography variant="h6">Điểm số</Typography>
                    <Divider/>
                    <Typography variant="h6">{totalPoint}</Typography>
                </Paper>
                <Paper elevation={2} sx={{width: {xs: `100%`, md: `49%`}, textAlign: `center`, padding: `5px`}}>
                    <Typography variant="h6">Điểm chữ</Typography>
                    <Divider/>
                    <Typography variant="h6">{convertNumberMarkToLetterMark(totalPoint)}</Typography>
                </Paper>
              </Stack>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    >
                        <Typography sx={{fontWeight: `bold`}}>{sample.alabel}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={"column"} sx={{width: `100%`}} gap={2}>
                            {generateSelectOption(sample.adata, aPoint, setAPoint)}
                        <Divider/>
                        </Stack>
                        <Grid container sx={{width: `100%`}} alignItems="center">
                            <Grid xs={6} md={11}>
                                <Typography variant="h6">Điểm </Typography>
                            </Grid>
                            <Grid xs={6} md={1}>
                                <Typography variant="h6" sx={{textAlign: "center"}}>{aTotalPoint}</Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
              </Accordion>
              <Accordion>
                    <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    >
                        <Typography sx={{fontWeight: `bold`}}>{sample.blabel}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={"column"} sx={{width: `100%`}} gap={1}>
                            {generateSelectOption(sample.bdata, bPoint, setBPoint)}
                            <Divider/>
                        </Stack>
                        <Grid container sx={{width: `100%`}} alignItems="center">
                            <Grid xs={6} md={11}>
                                <Typography variant="h6">Điểm </Typography>
                            </Grid>
                            <Grid xs={6} md={1}>
                                <Typography variant="h6" sx={{textAlign: "center"}}>{bTotalPoint}</Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
              </Accordion>
              <Accordion>
                    <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    >
                        <Typography sx={{fontWeight: `bold`}}>{sample.clabel}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={"column"} sx={{width: `100%`}} gap={2}>
                        {generateSelectOption(sample.cdata, cPoint, setCPoint)}
                        <Divider/>
                        </Stack>
                        <Grid container sx={{width: `100%`}} alignItems="center">
                            <Grid xs={6} md={11}>
                                <Typography variant="h6">Điểm </Typography>
                            </Grid>
                            <Grid xs={6} md={1}>
                                <Typography variant="h6" sx={{textAlign: "center"}}>{cTotalPoint}</Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
              </Accordion>
                </>
                }
            </Stack>
            {!isReportApproved? <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'fixed', bottom: `5%`, right: `3%` }}
                icon={<SpeedDialIcon openIcon={<Edit />} />}
                open={open}
                onOpen={e => setOpen(true)}
                onClose={e => setOpen(false)}
            >
                {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={e => {action.onClick(); setOpen(false)}}
                />
                ))}
            </SpeedDial>: <></>}
        </Stack>
    )
}

export default PointSheet;