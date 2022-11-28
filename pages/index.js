import { Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../common/localStorage";
import { isLoggedIn } from "../common/utils";
import { setIsLoggedIn } from "../features/userSlice";

export default function Home() {

  const router = useRouter();
  const userData = useSelector(state => state.user.data);

  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if(Object.keys(userData).length > 0) {
      roleCheck();
    }
  }, [userData])

  const roleCheck = () => {
    console.log(userData);
    if(userData.role.includes("0") || userData.role.includes("1"))
      setIsUser(true);
    
    if(userData.role.includes("2") || userData.role.includes("3"))
      setIsAdmin(true);
  }

  const toAdminPage = () =>{
    router.push("/admin");
  }

  const toUserPage = () => {
    router.push("/user");
  }

  return (
    <>
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
              height: `65vh`,
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
                  {!(Object.keys(userData).length > 0)? <Stack direction="column" alignItems={"center"} gap={2} justifyContent={"center"} sx={{width: `100%`, py: `20%`}}>
                      <CircularProgress />
                      <Typography>Đang tải ...</Typography>
                  </Stack>: 
                  <Stack direction="column" alignItems={"center"} gap={2} justifyContent={"center"} sx={{width: `100%`, py: `20%`}}>
                      {isAdmin?<Button variant="contained" onClick={() => toAdminPage()}>Đến trang quản lý</Button>:<></>}  
                      {isUser?<Button variant="contained" onClick={() => toUserPage()}>Đến trang người dùng</Button>:<></>}  
                  </Stack>}
              </Stack>
            </Paper>
      </Box>
    </>
  )
}
