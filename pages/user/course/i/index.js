import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Stack, Breadcrumbs, Typography, Button, Box, Tab, LinearProgress } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../../common/localStorage";
import { miliSecToDateOnly, sendAuthGetRequest } from "../../../../common/utils";
import UserLayout from "../../../../component/layout/UserLayout";
import AllImark from "../../../../component/user/course/i/AllImark";
import Create from "../../../../component/user/course/i/Create";
import Current from "../../../../component/user/course/i/Current";
import Expired from "../../../../component/user/course/i/Expired";
import Pending from "../../../../component/user/course/i/Pending";
import { setReloadImark } from "../../../../features/commonSlice";
import { setCurrentPage } from "../../../../features/pathSlice";

const IMark = () => {

    const dispatch = useDispatch();
    const [currentSemester, setCurrentSemester] = useState(null);
    const [tab, setTab] = useState("1");
    const [open, setOpen] = useState(false);
    const [onProcess, setOnProcess] = useState(false); 

    useEffect(() => {
        dispatch(setCurrentPage("course"));
    });

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
            {open? <Create open={open} setOpen={setOpen} />: <></>}
         <Grid container width={"100%"} alignItems="center">
            <Grid xs={12} md={8} lg={10}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/user">
                    Trang chủ
                    </Link>
                    <Link underline="hover" color="inherit" href="/user/course">
                    Nhóm học phần
                    </Link>
                    <Typography color="text.primary">Điểm I</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid xs={12} md={4} lg={2}>
            {tab == 1 ?<Stack direction={"row"} gap={1}>
                <Button variant="contained" onClick={() => {setOpen(true)}} component="label" startIcon={<Add/>}>
                    Nhập điểm I
                </Button>
            </Stack>: <></>}
            </Grid>
         </Grid>
        <Typography variant="h5">Danh sách điểm I</Typography>
        <TabContext value={tab} sx={{
            width: `100%`,
            height: `100%`
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                <Tab label="Đang thực hiện" value="1" />
                <Tab label="Đang chờ" value="2" />
                <Tab label="Tất cả" value="3" />
              </TabList>
            </Box>
            {onProcess? <LinearProgress />: <></>}
            <TabPanel value="1" sx={{
                width: `100%`,
                height: `100%`
                }}>
                <Current />
            </TabPanel>
            <TabPanel value="2" sx={{
                width: `100%`,
                height: `100%`
                }}>
                <Pending />
            </TabPanel>
            <TabPanel value="3" sx={{
                width: `100%`,
                height: `100%`
                }}>
                <AllImark />
            </TabPanel>
          </TabContext>
        </Stack>
    )
}

IMark.Layout = UserLayout;

export default IMark;