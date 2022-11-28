import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Breadcrumbs, Button, Divider, Unstable_Grid2 as Grid, Stack, Typography, Chip, IconButton, Tooltip, Skeleton, Box, Tab, BottomNavigation, BottomNavigationAction, SpeedDialAction, SpeedDialIcon, SpeedDial, LinearProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { sendAuthGetRequest } from "../../../common/utils";
import Committee from "../../../component/admin/thesis/Committee";
import Student from "../../../component/admin/thesis/Student";
import AdminLayout from "../../../component/layout/AdminLayout"
import TopicDocument from "../../../component/user/topic/TopicDocument";
import { setCurrentPage } from "../../../features/pathSlice";


const Topic = () => {

    
    const router = useRouter();
    const { detail } = router.query;
    const dispatch = useDispatch();

    const [tab, setTab] = useState('1');
    const [open, setOpen] = useState(false);
    const [onProcess, setOnProcess] = useState(false);

    const [dialOpen, setDialOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [topicData, setTopicData] = useState(null);
    const [students, setStudents] = useState([]);
    const [presentationData, setPresentationData] = useState([]);

    useEffect(() => {
        dispatch(setCurrentPage("search"));
    })

    useEffect(() => {
        if(detail && topicData == null) {
            getData(detail);
        }
    }), [detail, topicData]; 

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() =>{
        if(topicData)
            getPresentationData();
    }, [topicData])


    const getData = async (id) => {
        let result = await sendAuthGetRequest("/api/topic?id="+id);
        if(result.status === 200) {
            console.log(result);
            setTopicData({
                  semesterValue: result.data.semester.semesterName,
                  schoolYear: result.data.semester.startYear + " - " + result.data.semester.endYear,
                  ... result.data
                });
            setStudents(result.data.member);
            setOnProcess(false);
        }else{
            setOnProcess(true);
        }
    }

    const getPresentationData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/presentation/topic?id="+topicData.id);
        console.log(result);
        if(result.status == 200){
            setPresentationData(result.data);
            setOnProcess(false);
        }else{
            setOnProcess(true);
        }
    }

    return (
    <Stack direction={"column"} gap={1} sx={{
        width: `100%`,
        overflowY: `auto`,
        overflowX: 'hidden',
        height: `100%`,
    }}>
        {onProcess? <LinearProgress/>:<></>}
        <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/user">
                    Trang chủ
                    </Link>
                    <Link underline="hover" color="inherit" href="/user/search">
                    Tìm kiếm
                    </Link>
                    <Typography color="text.primary">Đề tài luận văn</Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
        {topicData? <Typography variant="h5">{topicData.name}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
        {topicData? <Typography>{topicData.enName}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
        <TabContext value={tab} sx={{
            width: `100%`,
            height: `100%`
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                <Tab label="Thông tin" value="1" />
                <Tab label="Hội đồng luận văn" value="2" />
                <Tab label="Tài liệu" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{
                width: `100%`,
                height: `100%`
                }}>
                <Stack direction="column" gap={2} sx={{width: `100%`}}>
                <Grid container sx={{width: `100%`}}>
                    <Grid container xs={12} spacing={1} sx={{width: `100%`}}>
                        <Grid xs={12} >
                            {topicData? <Typography variant="h6">Thông tin cơ bản</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                        </Grid>
                        <Grid xs={12} md={5}>
                            {topicData? <Typography><span style={{fontWeight: `bold`}}>Học kỳ:</span> {topicData.semester.semesterCode == 1? "I": "II"}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                        </Grid>
                        <Grid xs={12} md={5}>
                            {topicData?<Typography><span style={{fontWeight: `bold`}}>Năm học:</span> {topicData.schoolYear}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                        </Grid>
                        <Grid xs={12} md={5}>
                            {topicData?<Typography><span style={{fontWeight: `bold`}}>GVGD:</span>  {topicData.lecturer.name}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                        </Grid>
                        <Grid xs={12} md={5}>
                            {topicData?<Typography><span style={{fontWeight: `bold`}}>MSGV:</span> {topicData.lecturer.account}</Typography>:<Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                        </Grid>
                        <Grid xs={12}>
                            {topicData? <Stack direction="row" alignItems={"center"} gap={1}><Typography sx={{fontWeight: `bold`}}>Trạng thái: </Typography> 
                            <Chip label={topicData.status} color={topicData.statusCode == "1"? "success": topicData.statusCode == "2"? 
                                                                    "primary": topicData.statusCode == "3"? "error": "info"}/></Stack>: 
                            <Skeleton variant="text" sx={{ fontSize: '1rem', width: `50%` }} />}
                        </Grid>
                    </Grid>
                </Grid>
                <Typography variant="h6">Sinh viên thực hiện</Typography>
                <Student data={students} />
                </Stack>
            </TabPanel>
            <TabPanel value="2" sx={{
                width: `100%`,
                height: `100%`
                }}>
                  <Stack direction="column" sx={{width: `100%`}}>
                  {presentationData.length > 0? 
                    presentationData.map(p => {
                        return (<Committee key={p.id} data={p} />)
                    })
                    :<></>}
                  </Stack>
            </TabPanel>
            <TabPanel value="3" sx={{
                width: `100%`,
                height: `100%`
                }}>
                   <TopicDocument topicData={topicData} id={topicData ? topicData.id: ""} />
            </TabPanel>
          </TabContext>
    </Stack>
    )
}

Topic.Layout = AdminLayout;

export default Topic;