import { Alert, Box, Button, Divider, LinearProgress, Link, Paper, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sendAuthPostResquest } from "../../../common/utils";

const Activation = () =>{
    const dispatch = useDispatch();
    const router = useRouter();
    const [onProcess, setOnProcess] = useState(false);
    const [password, setPassword] = useState("");
    const [retypePassword ,setRetypePassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isReTypePasswordValid, setIsReTypePasswordValid] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);


    const { activationCode } = router.query;
    const [account, setAccount] = useState(activationCode? activationCode.substring(0, activationCode.indexOf("_")): "");
    const [code, setCode] = useState("");

    useEffect(() => {
      if(activationCode) {
        setAccount(activationCode.substring(0, activationCode.indexOf("_")));
        setCode(activationCode.substring(activationCode.indexOf("_") + 1));
      }
    }, [activationCode])

    const submit = async () => {
      if(validate()) {
        setOnProcess(true);
        let data = new FormData();
        data.append("account", account);
        data.append("password", password);
        data.append("activationCode", code);
        let result = await sendAuthPostResquest("/api/user/activate", data);
        if(result.status == 200) {
            setOnProcess(false);
            setIsSuccess(true);
            setTimeout(() => {
              router.push("/login");
            }, 2000);
        } else{
          
        }
      }
    }

    const validate = () => {
      if(password == "") {
        setIsPasswordValid(false);
        return false;
      }

      if(password != retypePassword){
        setIsReTypePasswordValid(false);
        return false;
      }

      return true;
    }

    const reset = () =>{
      setIsPasswordValid(true);
      setIsReTypePasswordValid(true);
      setPassword("");
      setRetypePassword("");
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
                  backgroundColor: `background.paper`,
                  height: `57vh`,
                  width: `600px`,
                  [theme.breakpoints.down("sm")]: {
                    width: `98vw`
                  }
                })}>
                  <Stack direction="column"
                        spacing={3}
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
                      {onProcess? <LinearProgress />: <></>}
                      <Stack direction="column">
                      <Typography sx={theme => ({
                        fontSize: `2em`,
                        [theme.breakpoints.down("md")]:{
                          fontSize: '1.5em',
                        },
                      })}>
                        Quản lý hội đồng luận văn</Typography>
                      <Typography sx={theme => ({
                        fontSize: `1.3em`,
                        [theme.breakpoints.down("md")]:{
                          fontSize: '1.1em',
                        },
                      })}>Kích hoạt tài khoản</Typography>
                      </Stack>
                        <Stack direction="column"
                        spacing={4}>
                          <TextField color="secondary" error={!isPasswordValid} helperText={isPasswordValid? "" : "Mật khẩu không hợp lệ"} required value={password} type="password" onChange={(e) => {setPassword(e.target.value)}} label="Mật khẩu"/>
                          <TextField color="secondary" error={!isReTypePasswordValid} helperText={isReTypePasswordValid? "" : "Mật khẩu không hợp lệ"} required value={retypePassword} type="password" onChange={(e) => {setRetypePassword(e.target.value)}} label="Nhập lại mật khẩu"/>
                        </Stack>
                      {isSuccess? <Alert severity="primary">Kích hoạt tài khoản thành công!</Alert>: <></>}
                      <Stack direction="rơw" alignItems={"center"} justifyContent="center">
                        <Button size="large" sx={{width: `200px`}} onClick={() => submit()} variant="contained">Kích hoạt</Button>
                      </Stack>
                  </Stack>
                </Paper>
          </Box>
    )
}

export default Activation;