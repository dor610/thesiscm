import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Breadcrumbs, Button, Unstable_Grid2 as Grid, Tab, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CreateSemester from "../../../component/admin/semester/CreateSemester";
import CurrentSemester from "../../../component/admin/semester/CurrentSemester";
import EditSemester from "../../../component/admin/semester/EditSemester";
import PassSemester from "../../../component/admin/semester/PassSemester";
import AdminLayout from "../../../component/layout/AdminLayout";
import { setCurrentPage } from "../../../features/pathSlice";

const Semester = () =>{

    const dispatch = useDispatch();
    const [tab, setTab] = useState('1');

    const [openCreate, setOpenCreate] = useState(false);
    const [upcomingLoad, setUpcomingLoad] = useState(true);
    const [passLoad, setPassLoad] = useState(true);

    useEffect(() => {
        dispatch(setCurrentPage("semester"));
    });

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`
        }}>
        <CreateSemester open={openCreate} setOpen={setOpenCreate} upcomingReload={setUpcomingLoad} passReload={setPassLoad}/>
        <EditSemester upcomingReload={setUpcomingLoad} passReload={setPassLoad} />
         <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/admin">
                    Trang chủ
                    </Link>
                    <Typography color="text.primary">Học kỳ</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid md={3} lg={2} xl={1.5}>
                <Button onClick={(e) => {setOpenCreate(true)}} size="large" variant="contained" startIcon={<Add />}>
                    Tạo mới
                </Button>
            </Grid>
         </Grid>
        <TabContext value={tab} sx={{
            width: `100%`,
            height: `100%`
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                <Tab label="Học kỳ" value="1" />
                <Tab label="Đã diễn ra" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{
                width: `100%`,
                height: `100%`
                }}>
                <CurrentSemester load={upcomingLoad} setLoad={setUpcomingLoad} />
            </TabPanel>
            <TabPanel value="2" sx={{
                width: `100%`,
                height: `100%`
                }}>
                <PassSemester load={passLoad} setLoad={setPassLoad} />
            </TabPanel>
          </TabContext>
        </Stack>
    );
}

Semester.Layout = AdminLayout;
export default Semester;