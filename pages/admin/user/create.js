import { ArrowBackIos, ArrowBackIosNew } from "@mui/icons-material";
import { Alert, Breadcrumbs, Button, Checkbox, Chip, Divider, FormControl, IconButton, InputLabel, LinearProgress, ListItemText, MenuItem, OutlinedInput, Select, TextField, Tooltip, Typography, Unstable_Grid2 as Grid} from "@mui/material";
import { Box, Stack } from "@mui/system";
import AdminLayout from "../../../component/layout/AdminLayout";
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendAuthGetRequest, sendAuthPostResquest } from "../../../common/utils";
import { setUserRoles } from "../../../features/userSlice";
import Link from "next/link";
import { setCurrentPage } from "../../../features/pathSlice";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateUser = () =>{

    const dispatch = useDispatch();
    const [onProcess, setOnProcess] = useState(false);
    const [userRoles, setUserRoles] = useState({});
    const [userTitles, setUserTitles] = useState([]);

    const [createSuccess, setCreateSuccess] = useState(false);
    const [createFail, setCreateFail] = useState(false);

    const [accountValid, setAccountValid] = useState(true);
    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [titleValid, setTitleValid] = useState(true);

    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("0");
    const [roleArr, setRoleArr] = useState([]);
    const [title, setTitle] = useState("1");

    useEffect(() => {
        dispatch(setCurrentPage("user"));
    })

    useEffect(() =>{
        if(Object.keys(userRoles).length == 0) {
            getRoles();
        }
        if(userTitles.length == 0) {
            getTitle();
        }
    });

    const reset = () =>{
        setOnProcess(false);
        setCreateSuccess(false);
        setCreateFail(false)
        resetValidation();
        resetData();
    }

    const onRoleChange = (event) => {
        const {
          target: { value },
        } = event;
        setRoleArr(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const register = async () =>{
        setCreateSuccess(false);
        setCreateFail(false)
        resetValidation();
        if(validate()){
            setOnProcess(true);
            let data = new FormData();
            data.append("account", account);
            data.append("name", userName);
            data.append("email", email);
            data.append("phone", phone);
            data.append("role", role);
            data.append("title", title);

            let res = await sendAuthPostResquest("/api/user", data);
            if(res.status === 200) {
                setCreateSuccess(true);
                setOnProcess(false);
                resetData();
                resetValidation();
            } else{
                setCreateFail(false);
                setOnProcess(false);
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
        if(phone !== "" && phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) === null) {
            result = false;
            setPhoneValid(false);
        }

        return result;
    }

    const resetData = () =>{
        setAccount("");
        setUserName("");
        setEmail("");
        setPhone("");
        setRole("0");
        setTitle("1");
    }

    const resetValidation = () =>{
        setAccountValid(true);
        setNameValid(true);
        setEmailValid(true);
        setPhoneValid(true);
        setTitleValid(true);
    }

    const getRoles = async () =>{
        let res = await sendAuthGetRequest("/api/user/role");
        console.log(res);
        if(res.status === 200){
            let obj = {};
            Object.keys(res.data).map(key =>{
                obj[res.data[key]] = key;
            })
            console.log(obj);
            setUserRoles(obj);
        }
    }

    const getTitle = async () =>{
        let res = await sendAuthGetRequest("/api/user/title");
        if(res.status === 200){
            let arr = [];
            Object.keys(res.data).map((key) =>{
                arr.push({value: key, label: res.data[key]});
            });
            setUserTitles(arr);
        }
    }

    return (
        <Stack direction={"column"} spacing={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/admin">Trang chủ</Link>
                <Link underline="hover" color="inherit" href="/admin/user">Người dùng</Link>
                <Typography color="text.primary">Tạo mới</Typography>
            </Breadcrumbs>
            <Stack direction="row" 
                    alignItems="center"
                    spacing={2}
                    sx= {{
                        paddingLeft: `10px`,
                        paddingRight: `10px`
                    }}>
                {true? <></>:<Link href={"/admin/user"}>
                    <Tooltip arrow title="Trở về" placement="right">
                        <IconButton>
                            <ArrowBackIosNew />
                        </IconButton>
                    </Tooltip>
                </Link>}
                <Typography variant="h5">Tạo tài khoản người dùng</Typography>
            </Stack>
            <Divider/>
            {onProcess? <LinearProgress />: <></>}
            {createFail? <Alert severity="error">Có lỗi xảy ra hoặc người dùng đã tồn tại!</Alert>: <></>}
            {createSuccess? <Alert severity="success">Tạo người dùng thành công!</Alert>: <></>}
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
                    <TextField fullWidth color="secondary" error={!accountValid} helperText={accountValid? "" : "Mã giảng viên không hợp lệ"} required value={account} onChange={(e) => {setAccount(e.target.value)}} label="Mã giảng viên"/>
                    <TextField fullWidth color="secondary" error={!nameValid} helperText={nameValid? "" : "Họ tên giảng viên không hợp lệ"} required value={userName} onChange={(e) => {setUserName(e.target.value)}} label="Họ tên giảng viên"/>
                </Stack>
                <Stack direction={{sx: "column", md: "row"}} alignItems='center'
                    justifyContent="center" sx={{
                    width: `100%`,
                    gap: `40px`
                }}>
                    <TextField fullWidth color="secondary" error={!emailValid} helperText={emailValid? "" : "Email không hợp lệ"} required value={email} onChange={(e) => {setEmail(e.target.value)}} label="Email"/>
                    <TextField fullWidth color="secondary" error={!phoneValid} helperText={phoneValid? "" : "Số điện thoại không hợp lệ"} value={phone} onChange={(e) => {setPhone(e.target.value)}} label="Số điện thoại"/>
                </Stack>
                <Stack direction={{sx: "column", md: "row"}} alignItems='center'
                    justifyContent="center" sx={{
                    width: `100%`,
                    gap: `40px`
                }}>
                    <FormControl fullWidth>
                        <InputLabel color="secondary" id="multiple-student-checkbox-label">Vai trò *</InputLabel>
                        <Select
                            labelId="multiple-student-checkbox-label"
                            id="multiple-student-checkbox"
                            multiple
                            color="secondary"
                            fullWidth
                            value={roleArr}
                            input={<OutlinedInput label="Vai trò *" />}
                            onChange={onRoleChange}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            >
                            {Object.keys(userRoles).map((name) => (
                                <MenuItem  key={"individual_"+name} value={name}>
                                <Checkbox checked={roleArr.indexOf(name) > -1} />
                                <ListItemText primary={name} />
                                </MenuItem >
                            ))}
                            </Select>
                    </FormControl>
                    <TextField fullWidth color="secondary" select={userTitles.length > 0} required value={title} onChange={(e) => {setTitle(e.target.value)}} label="Học hàm/ Học vị">
                    {userTitles.length > 0 ? userTitles.map((option) => (
                        <MenuItem  key={option.value+option.label.replace(/\s/, "")} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
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
                      <Button disabled={onProcess} size="large" color={"secondary"} onClick={reset} variant="outlined">Đặt lại</Button>
                      <Button disabled={onProcess} size="large" onClick={register} variant="contained">Tạo người dùng</Button>
            </Box>
        </Stack>
    )
}

CreateUser.Layout = AdminLayout;
export default CreateUser;