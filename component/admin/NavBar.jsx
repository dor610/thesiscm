import { BarChart, CalendarMonth, Group, PendingActions, Person, School } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";

const menuList = [
    { title: "Thống kê", icon: <BarChart />, link: "/admin", name: "dashboard"},
    { title: "Nhóm học phần", icon: <School />, link: "/admin/group", name: "group"},
    { title: "Người dùng", icon: <Person />, link: "/admin/user", name: "user" },
    { title: "Thời gian học kỳ", icon: <PendingActions />, link: "/admin/semester", name: "semester"},
    { title: "Hội đồng luận văn", icon: <Group />, link: "/admin/committee", name: "committee"},
    { title: "Lịch báo cáo", icon: <CalendarMonth />, link: "/admin/schedule", name: "schedule"},
];

const NavBar = ({open}) =>{

    const currentPage = useSelector(state => state.path.currentPage);

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
                                backgroundColor: `background.secondary`,
                                borderRadius: `20px`,
                                ":hover": {
                                    backgroundColor: `background.secondary`,
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
          </List>
    )
}

export default NavBar;