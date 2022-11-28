import { Box, Breadcrumbs, Button, Unstable_Grid2 as Grid, Stack, Tab, Typography } from "@mui/material";
import Link from "next/link"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../component/layout/AdminLayout";
import { setCurrentPage } from "../../../features/pathSlice";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Add } from "@mui/icons-material";
import EnabledUser from "../../../component/admin/user/EnabledUser"
import DisabledUser from "../../../component/admin/user/DisabledUser";
import InactiveUser from "../../../component/admin/user/InactiveUser";

const User = () =>{

    const dispatch = useDispatch();
    const [tab, setTab] = useState('1');

    useEffect(() => {
        dispatch(setCurrentPage("user"));
    })

    return (
    <Stack direction={"column"} spacing={1} sx={{
        width: `100%`,
        height: `100%`
    }}>
     <Grid container width={"100%"} alignItems="center">
        <Grid md={9} lg={10} xl={10.5}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/admin">
                Trang chủ
                </Link>
                <Typography color="text.primary">Người dùng</Typography>
            </Breadcrumbs>
        </Grid>
        <Grid md={3} lg={2} xl={1.5}>
            <Link href={"/admin/user/create"}>
                <Button size="large" variant="contained" startIcon={<Add />}>
                    Tạo mới
                </Button>
            </Link>
        </Grid>
     </Grid>
    <TabContext value={tab} sx={{
        width: `100%`,
        height: `100%`
    }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
            <Tab label="Đang hoạt động" value="1" />
            <Tab label="Vô hiệu hoá" value="2" />
            <Tab label="Chưa kích hoạt" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{
            width: `100%`,
            height: `100%`
            }}>
            <EnabledUser />
        </TabPanel>
        <TabPanel value="2" sx={{
            width: `100%`,
            height: `100%`
            }}>
            <DisabledUser />
        </TabPanel>
        <TabPanel value="3" sx={{
            width: `100%`,
            height: `100%`
            }}>
            <InactiveUser />
        </TabPanel>
      </TabContext>
    </Stack>)

}

User.Layout = AdminLayout;

export default User;