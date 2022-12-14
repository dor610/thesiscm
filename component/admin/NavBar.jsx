import { AccessTime, BarChart, CalendarMonth, Group, Logout, MenuBook, PendingActions, Person, School, Search } from "@mui/icons-material";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfo } from "../../common/localStorage";
import { setAccount, setIsLoggedOut, setUserData, setUserId } from "../../features/userSlice";

const menuList = [
    { title: "Thống kê", icon: <BarChart />, link: "/admin", name: "dashboard", role: ['2', '3']},
    { title: "Nhóm học phần", icon: <School />, link: "/admin/course", name: "course", role: ['2']},
    { title: "Người dùng", icon: <Person />, link: "/admin/user", name: "user" , role: ['2']},
    { title: "Học kỳ", icon: <AccessTime />, link: "/admin/semester", name: "semester", role: ['2']},
    { title: "Lịch báo cáo", icon: <PendingActions />, link: "/admin/schedule", name: "schedule", role: ['2']},
    { title: "Đề tài luận văn", icon: <MenuBook />, link: "/admin/thesis", name: "thesis", role: ['2', '3']},
    { title: "Tìm kiếm", icon: <Search />, link: "/admin/search", name: "search", role: ['2', '3']},
    
];

const NavBar = ({open}) =>{

    const currentPage = useSelector(state => state.path.currentPage);
    const userName = useSelector(state => state.user.name);
    const userRole = useSelector(state => state.user.role);
    const router = useRouter();
    const dispatch = useDispatch();

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
                <Typography sx={{textAlign: "center"}} variant="h7">{userRole && userRole.includes("2")? "Thư ký bộ môn": "Quản lý bộ môn"}</Typography>
            </Stack>: <></>}
            {open? <Divider />: <></>}
        <List>
            {menuList.map((row, index) => (
              
              <>
              {verify(userRole, row.role)?<ListItem key={row.title} disablePadding sx={{ display: 'block' }}>
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
              </ListItem>:""}
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