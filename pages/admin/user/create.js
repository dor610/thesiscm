import { ArrowBackIos, ArrowBackIosNew } from "@mui/icons-material";
import { Alert, Button, Divider, IconButton, MenuItem, TextField, Tooltip, Typography, Unstable_Grid2 as Grid} from "@mui/material";
import { Box, Stack } from "@mui/system";
import AdminLayout from "../../../component/layout/AdminLayout";
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest, sendAuthPostResquest } from "../../../common/utils";
import { setUserRoles } from "../../../features/userSlice";
import Link from "next/link";
import { setCurrentPage } from "../../../features/pathSlice";

const CreateUser = () =>{

    const dispatch = useDispatch();

    const [userRoles, setUserRoles] = useState([]);

    const [createSuccess, setCreateSuccess] = useState(true);
    const [createFail, setCreateFail] = useState(true);

    const [accountValid, setAccountValid] = useState(true);
    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [roleValid, setRoleValid] = useState(true);
    const [titleValid, setTitleValid] = useState(true);

    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("C");
    const [title, setTitle] = useState("");

    useEffect(() => {
        dispatch(setCurrentPage("user"));
    })

    useEffect(() =>{
        if(userRoles.length == 0) {
            getRoles();
        }
    });

    const reset = () =>{
        resetValidation();

        setAccount("");
        setUserName("");
        setEmail("");
        setPhone("");
        setRole("C");
        setTitle("");
    }

    const register = async () =>{
        resetValidation();
        if(validate()){
            let data = new FormData();
            data.append("account", account);
            data.append("name", userName);
            data.append("email", email);
            data.append("phone", phone);
            data.append("role", role);
            data.append("title", title);

            let res = sendAuthPostResquest("/api/user", data);
            if(res.status === 200) {
                setCreateSuccess(false);
                reset();
            } else{
                setCreateFail(false);
            }
        }
    }

    const validate = () =>{
        let result = true;
        if(account === "") {
            result = false;
            setAccountValid(false);
        }
        if(userName === "") {
            result = false;
            setNameValid(false);
        }
        if(email === "") {
            result = false;
            setEmailValid(false);
        }
        if(!email.includes("@")){
            result = false;
            setEmailValid(false);
        }
        if(phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) === null) {
            result = false;
            setPhoneValid(false);
        }

        return result;
    }

    const resetValidation = () =>{
        setCreateSuccess(true);
        setCreateFail(true)
        setAccountValid(true);
        setNameValid(true);
        setEmailValid(true);
        setPhoneValid(true);
        setRoleValid(true);
        setTitleValid(true);
    }

    const getRoles = async () =>{
        let res = await sendAuthGetRequest("/api/user/role");
        if(res.status === 200){
            let arr = [];
            Object.keys(res.data).map((key) =>{
                arr.push({value: key, label: res.data[key]});
            });
            setUserRoles(arr);
        }
    }

    return (
        <Stack direction={"column"} spacing={2}>
            <Stack direction="row" 
                    alignItems="center"
                    spacing={2}
                    sx= {{
                        paddingLeft: `10px`,
                        paddingRight: `10px`
                    }}>
                <Link href={"/admin/user"}>
                    <Tooltip arrow title="Trở về" placement="right">
                        <IconButton>
                            <ArrowBackIosNew />
                        </IconButton>
                    </Tooltip>
                </Link>
                <Typography variant="h5">Tạo tài khoản người dùng</Typography>
            </Stack>
            <Divider/>
            {!createFail? <Alert severity="error">Tài khoản không tồn tại hoặc mật khẩu không hợp lệ!</Alert>: <></>}
            {!createSuccess? <Alert severity="success">Đăng nhập thành công!</Alert>: <></>}
            <Stack direction="column" sx={(theme) => ({
                gap: `40px`,
                [theme.breakpoints.up('md')]: {
                    p: `30px 5%`
                },
                [theme.breakpoints.up('md')]: {
                    p: `30px 10%`
                }
            })}>
                <Stack direction={{sx: "column", md: "row"}} alignItems='center'
                    justifyContent="center" sx={{
                    width: `100%`,
                    gap: `40px`
                }}>
                    <TextField fullWidth  error={!accountValid} helperText={accountValid? "" : "Mã giảng viên không hợp lệ"} required value={account} onChange={(e) => {setAccount(e.target.value)}} label="Mã giảng viên"/>
                    <TextField fullWidth  error={!nameValid} helperText={nameValid? "" : "Họ tên giảng viên không hợp lệ"} required value={userName} onChange={(e) => {setUserName(e.target.value)}} label="Họ tên giảng viên"/>
                </Stack>
                <Stack direction={{sx: "column", md: "row"}} alignItems='center'
                    justifyContent="center" sx={{
                    width: `100%`,
                    gap: `40px`
                }}>
                    <TextField fullWidth  error={!emailValid} helperText={emailValid? "" : "Email không hợp lệ"} required value={email} onChange={(e) => {setEmail(e.target.value)}} label="Email"/>
                    <TextField fullWidth  error={!phoneValid} helperText={phoneValid? "" : "Số điện thoại không hợp lệ"} value={phone} onChange={(e) => {setPhone(e.target.value)}} label="Số điện thoại"/>
                </Stack>
                <Stack direction={{sx: "column", md: "row"}} alignItems='center'
                    justifyContent="center" sx={{
                    width: `100%`,
                    gap: `40px`
                }}>
                    <TextField fullWidth select={userRoles.length > 0} error={!roleValid} helperText={roleValid? "" : "Chức vụ không hợp lệ"} required value={role} onChange={(e) => {setRole(e.target.value)}} label="Chức vụ">
                    {userRoles.length > 0 ? userRoles.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
                    <TextField fullWidth  error={!titleValid} helperText={titleValid? "" : "Học hàm/ Học vị không hợp lệ"} value={title} onChange={(e) => {setTitle(e.target.value)}} label="Học hàm/ Học vị"/>
                </Stack>
            </Stack>
            <Box sx={(theme) => ({
                      display: `flex`,
                      [theme.breakpoints.up("md")]: {
                        flexDirection: `row`,
                        gap: `40%`,
                        p: `0 10%`,
                      },
                      [theme.breakpoints.up("xs")]: {
                        flexDirection: `column-reverse`,
                        gap: '20px'
                      },
                      alignItems: 'center',
                      justifyContent: 'center',
                    }) }>
                      <Button size="large" onClick={reset} variant="outlined">Đặt lại</Button>
                      <Button size="large" onClick={register} variant="contained">Tạo người dùng</Button>
            </Box>
        </Stack>
    )
}

CreateUser.Layout = AdminLayout;
export default CreateUser;