import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Stack, Typography, Breadcrumbs, Button, Box, Tab } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import UserLayout from "../../../component/layout/UserLayout";
import AllTopic from "../../../component/user/topic/AllTopic";
import CreateTopic from "../../../component/user/topic/CreateTopic";
import CurrentTopic from "../../../component/user/topic/CurrentTopic";
import { setCurrentPage } from "../../../features/pathSlice";

const Topic = () => {
    const [currentSemester, setCurrentSemester] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const [tab, setTab] = useState('1');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(setCurrentPage("topic"));
    })

    useEffect(() => {
        getCurrentSemester();
    }, []);

    const getCurrentSemester = async () =>{
        let result = await sendAuthGetRequest("/api/semester/current");
        if(result.status === 200) {
            setCurrentSemester(result.data);
        }
    }

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`
        }}>
        {open ? <CreateTopic open={open} setOpen={setOpen}/> : <></>}
         <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/user">
                    Trang chủ
                    </Link>
                    <Typography color="text.primary">Đề tài luận văn</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid md={3} lg={2} xl={1.5}>
            {tab == 1 ? <Button variant="contained" onClick={() => {setOpen(true)}} component="label" startIcon={<Add/>}>
                Tạo mới
            </Button>: <></>}
            </Grid>
         </Grid>
        <Typography variant="h5">Đề tài luận văn tốt nghiệp</Typography>
        <TabContext value={tab} sx={{
            width: `100%`,
            height: `100%`
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                <Tab label={currentSemester? currentSemester.semesterName : "Học kỳ hiện tại"} value="1" />
                <Tab label="Tất cả" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{
                width: `100%`,
                height: `100%`
                }}>
                {currentSemester ? <CurrentTopic filter={false}/> : <Typography variant="h5">Học kỳ mới vẫn chưa bắt đầu</Typography>}
            </TabPanel>
            <TabPanel value="2" sx={{
                width: `100%`,
                height: `100%`
                }}>
                    <AllTopic />
            </TabPanel>
          </TabContext>
        </Stack>
    )
}

Topic.Layout = UserLayout;

export default Topic;