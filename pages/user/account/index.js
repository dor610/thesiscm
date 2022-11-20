import { Add, Edit } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Stack, Typography, Breadcrumbs, Button, Box, Tab, Chip, Skeleton, Divider } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import UserLog from "../../../component/admin/user/UserLog";
import UserLayout from "../../../component/layout/UserLayout";
import EditAccount from "../../../component/user/account/EditAcount";
import AllCourse from "../../../component/user/course/AllCourse";
import CourseDetail from "../../../component/user/course/CourseDetail";
import ImportStudent from "../../../component/user/course/ImportStudent";
import { setCurrentPage } from "../../../features/pathSlice";

const User = () => {
    const account = useSelector(state => state.user.account);
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("1");
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [onProcess, setOnProcess] = useState(false);
    const [message, setMessage] = useState("");

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        dispatch(setCurrentPage("account"));
    });

    useEffect(() => {
        if(reload){
            setReload(false);
            getData();
        }
    }, [reload]);

    useEffect(() => {
        if(account && !userData) {
            getData();
        }
    }, [account, userData]);

    const getData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/user/account?account="+account);
        if(result.status == 200) {
            setOnProcess(false);
            setUserData(result.data);

        } else {
            setOnProcess(false);
            setMessage("Đã có lỗi xảy ra khi truy vấn thông tin người dùng, vui lòng tải lại trang");
            setIsError(true);
        }
    }

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`
        }}>
        {userData? <EditAccount open={open} setOpen={setOpen} userData={userData} setReload={setReload} />: <></>}
         <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/user">
                    Home
                    </Link>
                    <Typography color="text.primary">Account</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid md={3} lg={2} xl={1.5}>
                <Button startIcon={<Edit/>} variant="contained" onClick={() => {setOpen(true)}}>
                    Chỉnh sửa
                </Button>
            </Grid>
         </Grid>
        <Typography variant="h5">Thông tin về {userData? userData.title +". " + userData.name: "Người dùng"}</Typography>
        <Divider />
        <Stack direction="column"  gap={1} sx={{width: `100%`, height: `100%`}}>
            <Grid container spacing={2} sx={{width: `100%`}}>
                <Grid xs={12} >
                    <Typography variant="h6">Thông tin cơ bản</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    {userData? <Typography>Mã giảng viên: {userData.account}</Typography>: 
                    <Skeleton variant="rectangular" width={`50%`}/>}
                </Grid>
                <Grid xs={12} md={5}>
                {userData?<Typography>Email: {userData.email}</Typography>:<Skeleton variant="rectangular" width={`50%`}/>}
                </Grid>
                <Grid xs={12} md={5}>
                {userData?<Typography>Học hàm/ Học vị: {userData.fullTitle}</Typography>:<Skeleton variant="rectangular" width={`50%`}/>}
                </Grid>
                <Grid xs={12} md={5}>
                    {userData?<Typography>Vai trò: {userData.fullRole}</Typography>:<Skeleton variant="rectangular" width={`50%`}/>}
                </Grid>
                <Grid xs={12} md={5}>
                    {userData?<Typography>Số điện thoại: {userData.phone? userData.phone : ""}</Typography>:<Skeleton variant="rectangular" width={`50%`}/>}
                </Grid>
                <Grid xs={12} md={5}>
                    {userData?<Stack direction="row" alignItems={"center"} gap={2}><Typography>Trạng thái: </Typography> 
                        <Chip label={userData.status} color={userData.statusCode == "1"? "info": userData.statusCode == "2"? "error": "primary"}/>
                    </Stack>:<Skeleton variant="rectangular" width={`50%`}/>}
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
                        <AllCourse />
                </TabPanel>
            </TabContext>

        </Stack>
        </Stack>
    )
}

User.Layout = UserLayout;

export default User;