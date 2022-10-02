import { Alert, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfo, setData } from "../../common/localStorage";
import { errorNotify, notify } from "../../common/toastify";
import { sendAuthGetRequest, sendLoginRequest } from "../../common/utils";
import { resetLoginStatus, setAccount, setIsLoggedIn, setLoginFail, setLoginSuccess, setUserData } from "../../features/userSlice";

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const loginSuccess = useSelector(state => state.user.loginSuccess);
    const loginFail = useSelector(state => state.user.loginFail);
    const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
    const [account, setUserAccount] = useState("");
    const [password, setPassword] = useState("");
    const [isAccountValid, setIsAccountValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    
    useEffect(() =>{
      if(isUserLoggedIn){
        router.push("/");
      }
    }, [isUserLoggedIn]);

    useEffect( () =>{
       if(loginSuccess) {
          getUserData();
       }
    }, [loginSuccess]);

    const getUserData = async () =>{
      let result = await sendAuthGetRequest("/api/user?account="+account);
      if(result.status === 200) {
        dispatch(setUserData(result.data));
        setData("user", JSON.stringify(result.data));
        dispatch(setLoginSuccess(false));
        dispatch(setIsLoggedIn(true));
        router.push("/");
      }else {
        dispatch(resetLoginStatus());
        removeUserInfo();
        errorNotify("Đã xảy ra lỗi trong lúc truy xuất thông tin người dùng!")
      }
    }

    const validateData = () =>{
      let result = true;
      if(account === "") {
        setIsAccountValid(false);
        result = false;
      }

      if(password === "") {
        setIsPasswordValid(false);
        result = false
      }

      return result;
    }

    const resetValidation = () => {
      setIsAccountValid(true);
      setIsPasswordValid(true);
    }

    const login = async () =>{
      resetValidation();
      if(validateData()) {
        dispatch(resetLoginStatus());
        let formData = new FormData();
        formData.append("account", account);
        formData.append("password", password);
        let result = await sendLoginRequest(formData);
        if(result.status === 200) {
          setData("account", account);
          dispatch(setAccount(account));
          setData("token", result.authorization);
          dispatch(setLoginSuccess(true));
        } else {
          dispatch(setLoginFail(true));
        }
      }
    }
    
    return (
      <Box sx={{
        overflow: `hidden`,
        width: `100vw`,
        height: `100vh`,
        display: `flex`,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Paper elevation={5} sx={(theme) => ({
              backgroundColor: `background.secondary`,
              height: `65vh`,
              width: `600px`,
              [theme.breakpoints.down("sm")]: {
                width: `98vw`
              }
            })}>
              <Stack direction="column"
                    spacing={4}
                    sx={{
                      p: `5%`,
                    }}>
                  <Box
                    sx={{
                      width: `100%`,
                      display: `flex`,
                      alignItems: 'center',
                      gap: `10px`
                      
                    }}
                  >
                    <Box sx={{
                      width: `50px`,
                      height: `50px`,
                      backgroundColor: `background.primary`
                    }}></Box>
                    <Typography variant="h5">ThesisCM</Typography>
                  </Box>
                  <Divider />
                  <Stack direction="column">
                  <Typography sx={theme => ({
                    fontSize: `2.5em`,
                    [theme.breakpoints.down("md")]:{
                      fontSize: '2em',
                    },
                  })}>
                    Quản lý hội đồng luận văn</Typography>
                  <Typography sx={theme => ({
                    fontSize: `1.5em`,
                    [theme.breakpoints.down("md")]:{
                      fontSize: '1.25em',
                    },
                  })}>Đăng nhập</Typography>
                  </Stack>
                    <Stack direction="column"
                    spacing={3}>
                      <TextField error={!isAccountValid} helperText={isAccountValid? "" : "Mã giảng viên không hợp lệ"} required value={account} onChange={(e) => {setUserAccount(e.target.value)}} label="Mã giảng viên"/>
                      <TextField error={!isPasswordValid} helperText={isPasswordValid? "" : "Mật khẩu không hợp lệ"} required value={password} onChange={(e) => {setPassword(e.target.value)}} label="Mật khẩu"/>
                    </Stack>
                    <Box sx={{
                      display: `flex`,
                      flexDirection: `row`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: `300px`,
                    }}>
                      <Typography>Quên mật khẩu</Typography>
                      <Button onClick={login} variant="outlined">Đăng nhập</Button>
                    </Box>
                    
                  {loginFail? <Alert severity="error">Tài khoản không tồn tại hoặc mật khẩu không hợp lệ!</Alert>: <></>}
                  {loginSuccess? <Alert severity="success">Đăng nhập thành công!</Alert>: <></>}
              </Stack>
            </Paper>
      </Box>
    );
}