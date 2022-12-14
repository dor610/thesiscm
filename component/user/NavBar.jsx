import { BarChart, CalendarMonth, Group, Home, Logout, MenuBook, Notifications, PendingActions, Person, School, Search } from "@mui/icons-material";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfo } from "../../common/localStorage";
import { setAccount, setIsLoggedIn, setIsLoggedOut, setUserData, setUserId } from "../../features/userSlice";

const menuList = [
    { title: "Tổng quan", icon: <Home />, link: "/user", name: "dashboard", role: ['1']},
    { title: "Nhóm học phần", icon: <School />, link: "/user/course", name: "course", role: ['1']},
    { title: "Đề tài luận văn", icon: <MenuBook />, link: "/user/topic", name: "topic", role: ['1']},
    { title: "Lịch báo cáo", icon: <PendingActions />, link: "/user/schedule", name: "schedule", role: [ '1', '0']},
    { title: "Tài khoản", icon: <Person />, link: "/user/account", name: "account", role: ['1']},
    { title: "Tìm kiếm", icon: <Search />, link: "/user/search", name: "search", role: ['1', '0']},
];

const NavBar = ({open}) =>{

    const currentPage = useSelector(state => state.path.currentPage);
    const userName = useSelector(state => state.user.name);
    const userRole = useSelector(state => state.user.role);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect

    const logout = () => {
        removeUserInfo();
        dispatch(setUserData({}));
        dispatch(setAccount(""));
        dispatch(setUserId(""));
        dispatch(setIsLoggedOut(true));
        router.push("/login");
    }

    const verify = (role, role1) => {
        for(let i = 0; i < role.length; i++){
            if(role1.includes(role[i]))
                return true;
        }
        return false;
    }
    return (
        <Stack direction="column" spacing={1}>
            {open?<Stack direction="column" sx={{ py: `20px`}}> 
                <Typography sx={{textAlign: "center"}} variant="h6">{userName}</Typography>
                <Typography sx={{textAlign: "center"}} variant="h7">{userRole && userRole.includes("1")? "Giảng viên": "Uỷ viên"}</Typography>
            </Stack>: <></>}
            {open? <Divider />: <></>}
        <List>
            {menuList.map((row, index) => (
              <>
              { verify(userRole, row.role)?
                <ListItem key={row.title} disablePadding sx={{ display: 'block' }}>
                <Link href={row.link}>
                    <Tooltip title={open? "": row.title} arrow placement="right">
                    <ListItemButton
                        selected = {row.name === currentPage}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            "&.Mui-selected": {
                                backgroundColor: `background.primary`,
                                borderRadius: `20px`,
                                ":hover": {
                                    backgroundColor: `background.primary`,
                                }
                            },
                            ":hover": {
                                borderRadius: `20px`,
                                cursor: `pointer`,
                              }
                        }}
                        >
                            <ListItemIcon
                            sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            }}
                        >
                            {row.icon}
                        </ListItemIcon>
                        <ListItemText primary={row.title} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    </Tooltip>
                </Link>
              </ListItem>: ""
              }
              </>
            ))}

    <ListItem key={"đăng xuất"} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={open? "": "Đăng xuất"} arrow placement="right">
                    <ListItemButton
                        onClick={() => logout()}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            "&.Mui-selected": {
                                backgroundColor: `background.primary`,
                                borderRadius: `20px`,
                                ":hover": {
                                    backgroundColor: `background.primary`,
                                }
                            },
                            ":hover": {
                                borderRadius: `20px`,
                                cursor: `pointer`,
                              }
                        }}
                        >
                            <ListItemIcon
                            sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            }}
                        >
                            <Logout/>
                        </ListItemIcon>
                        <ListItemText primary={"Đăng xuất"} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    </Tooltip>
              </ListItem>
          </List></Stack>
    )
}

export default NavBar;