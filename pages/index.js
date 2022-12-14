import { Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../common/localStorage";
import { isLoggedIn } from "../common/utils";
import Authorization from "../component/layout/Authorization";
import { setIsLoggedIn } from "../features/userSlice";

export default function Home() {

  const router = useRouter();
  const userData = useSelector(state => state.user.data);
  const userRole = useSelector(state => state.user.role);

  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log(userRole);
    if(userRole.length > 0) {
      roleCheck();
    }
  }, [userRole])

  const roleCheck = () => {
    console.log(userData);
    if(userRole.includes("0") || userRole.includes("1"))
      setIsUser(true);
    
    if(userRole.includes("2") || userRole.includes("3"))
      setIsAdmin(true);
  }

  const redirect = (path) =>{
    router.push(path);
  }

  const toAdminPage = () =>{
    redirect("/admin");;
  }

  const toUserPage = () => {
    if (userRole.includes("1")) {
      redirect("/user");
    }else{
      redirect("/user/schedule");
    }
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
                    <Typography variant="h5">Hệ thống hỗ trợ quản lý luận văn tốt nghiệp ngành Kỹ thuật phần mềm</Typography>
                  </Box>
                  <Authorization />
                  <Divider />
                  {!(userRole && userRole.length > 0)? <Stack direction="column" alignItems={"center"} gap={2} justifyContent={"center"} sx={{width: `100%`, py: `20%`}}>
                      <CircularProgress />
                      <Typography>Đang tải ...</Typography>
                  </Stack>: 
                  <Stack direction="column" alignItems={"center"} gap={2} justifyContent={"center"} sx={{width: `100%`, py: `20%`}}>
                      {isAdmin?<Button variant="contained" sx={{width: `200px`}} onClick={() => toAdminPage()}>Đến trang quản lý</Button>:<></>}  
                      {isUser?<Button variant="contained" sx={{width: `200px`}} onClick={() => toUserPage()}>Đến trang người dùng</Button>:<></>}  
                  </Stack>}
              </Stack>
            </Paper>
      </Box>
    </>
  )
}
