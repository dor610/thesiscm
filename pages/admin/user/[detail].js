import { Check, Delete } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Breadcrumbs, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, LinearProgress, Tab, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../../common/toastify";
import { sendAuthGetRequest, sendAuthPostResquest } from "../../../common/utils";
import AllCourse from "../../../component/admin/user/AllCourse";
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

    const [openDelete, setOpenDelete] = useState(false);
    const [openActivate, setOpenActivate] = useState(false);
    const [reloadLog, setReloadLog] = useState(false);

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
        console.log(result);
        if(result.status === 200 ){
            setUserData(result.data);
            setOnProcess(false);
        }
    }

    const displayFunctionBtn = () =>{
        if(userData) {
            if(!userData.role.includes("2") || !userData.role.includes("3")){
                if(userData.statusCode == 3){
                    return (
                        <Button size="medium" variant="contained" onClick={() => {setOpenDelete(true)}} color={"error"} startIcon={<Delete />}>
                            Vô hiệu hoá
                        </Button>
                    )
                } else if (userData.statusCode ==  2){
                    return (
                        <Button size="medium" variant="contained" onClick={() => {setOpenActivate(true)}} color={"primary"} startIcon={<Check />}>
                            Kích hoạt
                        </Button>
                    )
                }
            }
        }
    }

    const deActive = async () => {
        let formData = new FormData();
        setOpenDelete(false);
        formData.append("account", userData.account);
        let res = await sendAuthPostResquest("/api/user/disabled", formData);
        if(res.status == 200) { 
            successNotify("Vô hiệu hoá tài khoản người dùng thành công.");
            getUserData(detail);
            setReloadLog(true);
        } else {
            errorNotify("Đã có lỗi xảy ra, vui lòng thực hiện lại.");
        }
    }

    const activate = async () => {
        let formData = new FormData();
        setOpenActivate(false);
        formData.append("account", userData.account);
        let res = await sendAuthPostResquest("/api/user/enabled", formData);
        if(res.status == 200) { 
            successNotify("Kích hoạt tài khoản người dùng thành công.");
            setReloadLog(true);
            getUserData(detail);
        } else {
            errorNotify("Đã có lỗi xảy ra, vui lòng thực hiện lại.");
        }
    }

    return (
        <Stack direction={"column"} gap={1} sx={{
            width: `100%`,
            height: `100%`,
        }}>
            <Dialog
                open={openDelete}
                onClose={e => setOpenDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Vô hiệu hoá tài khoản."}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Xác nhận vô hiệu hoá tài khoản của người dùng {userData? userData.name: ""}. Nếu bị vô hiệu hoá, người dùng sẽ không thể sử dụng hệ thống và cần phải được kích hoạt bởi người dùng quản lý
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button color="primary" onClick={e => setOpenDelete(false)}>Huỷ</Button>
                <Button color="error" onClick={e => deActive()} autoFocus>
                    Vô hiệu hoá
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openActivate}
                onClose={e => setOpenActivate(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Kích hoạt tài khoản."}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Xác nhận kích hoạt tài khoản của người dùng {userData? userData.name: ""}. Sau khi được kích hoạt, người dùng có thể sử dụng lại các chức năng của hệ thống.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button color="primary" onClick={e => setOpenActivate(false)}>Huỷ</Button>
                <Button color="success" onClick={e => activate()} autoFocus>
                    Kích hoạt
                </Button>
                </DialogActions>
            </Dialog>
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
                </TabList>
                </Box>
                <TabPanel value="1" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        {userData? <UserLog userId={userData.id} reload={reloadLog} setReload={setReloadLog}/>: <></>}
                </TabPanel>
                <TabPanel value="2" sx={{
                    width: `100%`,
                    height: `100%`
                    }}>
                        {userData?<AllCourse account={userData.account}/>: <></>}
                </TabPanel>
            </TabContext>
        </Stack>
    )
}

UserDetail.Layout = AdminLayout;
export default UserDetail;