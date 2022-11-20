import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tooltip } from "@mui/material";
import Link from "next/link";

const menuList = [
    { title: "Tổng quan", icon: <School />, link: "/presentation", name: "course"},
    { title: "Đề tài luận văn", icon: <MenuBook />, link: "/user/topic", name: "topic"},
    { title: "Lịch báo cáo", icon: <PendingActions />, link: "/user/schedule", name: "schedule"},
    { title: "Tài khoản", icon: <Person />, link: "/user/account", name: "account"},
    { title: "Tìm kiếm", icon: <Search />, link: "/user/search", name: "search"},
];

const NavBar = () => {

    return (
        <Paper elevation={2}>
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
                        </ListItemButton>
                        </Tooltip>
                    </Link>
                </ListItem>
                ))}
            </List>
        </Paper>
    )
}