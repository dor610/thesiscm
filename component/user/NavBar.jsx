import { BarChart, CalendarMonth, Group, Logout, MenuBook, PendingActions, Person, School, Search } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const menuList = [
    { title: "Nhóm học phần", icon: <School />, link: "/user/course", name: "course"},
    { title: "Đề tài luận văn", icon: <MenuBook />, link: "/user/topic", name: "topic"},
    { title: "Lịch báo cáo", icon: <PendingActions />, link: "/user/schedule", name: "schedule"},
    { title: "Tài khoản", icon: <Person />, link: "/user/account", name: "account"},
    { title: "Tìm kiếm", icon: <Search />, link: "/user/search", name: "search"},
    
];

const NavBar = ({open}) =>{

    const currentPage = useSelector(state => state.path.currentPage);
    const router = useRouter();

    const logout = () => {
        removeUserInfo();
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