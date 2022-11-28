import { Check, Delete } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Breadcrumbs, Button, Chip, Divider, LinearProgress, Tab, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import UserLog from "../../../component/admin/user/UserLog";
import AdminLayout from "../../../component/layout/AdminLayout";
import { setCurrentPage } from "../../../features/pathSlice";


const UserDetail = () =>{

    const router = useRouter();
    const { detail } = router.query;
    const [tab, setTab] = useState('1');
    const dispatch = useDispatch();

    const [userData, setUserData] = useState(null);
    const [onProcess, setOnProcess] = useState(false);

    useEffect(() =>{
        dispatch(setCurrentPage("user"));
    });

    useEffect(() => {
        if(detail && userData == null) {
            getUserData(detail);
        }
    }), [detail, userData]; 

    const getUserData = async (id) =>{
        setOnProcess(true);
        let result = await sendAuthGetRequest(`/api/user?id=${id}`);
        if(result.status === 200 ){
            setUserData(result.data);
            setOnProcess(false);
        }
    }

    const displayFunctionBtn = () =>{
        if(userData) {
            if(userData.role != "2" || userData.role != "3"){
                if(userData.statusCode == 3){
                    return (
                        <Button size="medium" variant="contained" onClick={() => {setOpen(true)}} color={"error"} startIcon={<Delete />}>
                            Vô hiệu hoá
                        </Button>
                    )
                } else if (userData.statusCode ==  2){
                    return (
                        <Button size="medium" variant="contained" onClick={() => {setOpen(true)}} color={"primary"} startIcon={<Check />}>
                            Kích hoạt
                        </Button>
                    )
                }
            }
        }
    }

    return (
        <Stack direction={"column"} gap={1} sx={{
            width: `100%`,
            height: `100%`,
        }}>
            <Grid container width={"100%"} alignItems="center">
                <Grid md={9} lg={10} xl={10.5}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/admin">
                        Trang chủ
                        </Link>
                        <Link underline="hover" color="inherit" href="/admin/user">
                        Người dùng
                        </Link>
                        <Typography color="text.primary">Chi tiết</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid md={3} lg={2} xl={1.5}>
                    {displayFunctionBtn()}
                </Grid>
            </Grid>
            <Typography variant="h5">{userData == null? "Người dùng": `${userData.title}. ${userData.name}`}</Typography>
            <Divider />
            {onProcess? <LinearProgress />:<></>}
            <Grid container spacing={2} sx={{width: `100%`}}>
                    <Grid xs={12} md={5}>
                        <Typography>{`MSGV: ${userData? userData.account : ""}`}</Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                        <Typography>{`Email: ${userData? userData.email: ""}`}</Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                        <Typography>{`Số điện thoại: ${userData? userData.phone: ""}`}</Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                        <Typography>{`Vai trò: ${userData? userData.fullRole : ""}`}</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Stack direction="row" alignItems={"center"} gap={2}><Typography>Trạng thái: </Typography> 
                            {userData? <Chip label={userData.status} color={userData.statusCode == "1"? "info": userData.statusCode == "2"? "error": "primary"}/>: <></>}
                        </Stack>
                    </Grid>
            </Grid>
            <TabContext value={tab} sx={{
                width: `100%`,
                height: `100%`
            }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(e, v) => {setTab(v)}} aria-label="lab API tabs example">
                    <Tab label="Lịch sử người dùng" value="1" />
                    <Tab label="Lớp học" value="2" />
                    <Tab label="Hội đồng luận văn" value="3" />
                </TabList>
                </Box>
                <TabPanel value="1" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        {userData? <UserLog userId={userData.id} />: <></>}
                </TabPanel>
                <TabPanel value="2" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        <></>
                </TabPanel>
                <TabPanel value="3" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        <></>
                </TabPanel>
            </TabContext>
        </Stack>
    )
}

UserDetail.Layout = AdminLayout;
export default UserDetail;