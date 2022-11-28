import { AccessTime, BarChart, CalendarMonth, Group, Logout, MenuBook, PendingActions, Person, School, Search } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfo } from "../../common/localStorage";
import { setAccount, setIsLoggedOut, setUserData, setUserId } from "../../features/userSlice";

const menuList = [
    { title: "Thống kê", icon: <BarChart />, link: "/admin", name: "dashboard"},
    { title: "Nhóm học phần", icon: <School />, link: "/admin/course", name: "course"},
    { title: "Người dùng", icon: <Person />, link: "/admin/user", name: "user" },
    { title: "Học kỳ", icon: <AccessTime />, link: "/admin/semester", name: "semester"},
    { title: "Lịch báo cáo", icon: <PendingActions />, link: "/admin/schedule", name: "schedule"},
    { title: "Đề tài luận văn", icon: <MenuBook />, link: "/admin/thesis", name: "thesis"},
    { title: "Tìm kiếm", icon: <Search />, link: "/admin/search", name: "search"},
    
];

const NavBar = ({open}) =>{

    const currentPage = useSelector(state => state.path.currentPage);
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

    return (
        <List>
            {menuList.map((row, index) => (
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
              </ListItem>
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
          </List>
    )
}

export default NavBar;