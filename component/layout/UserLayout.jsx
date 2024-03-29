import { Box, Paper, IconButton } from "@mui/material";

import { darken, lighten, styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiBox from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import NavBar from "../user/NavBar";
import Authorization from "./Authorization";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: `60px`,
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1.5),
  // necessary for content to be below app bar
  //...theme.mixins.toolbar,
}));

const AppBar = styled(MuiBox, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: `100vw`,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    borderRight: `none`,
    whiteSpace: 'nowrap',
    '> div': {
        border: `none`,
        backgroundColor: theme.palette.background.base,
      },
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function UserLayout({children}) {

  const router = useRouter();
  const userRole = useSelector(state => state.user.role);
    const [open, setOpen] = useState(true);

    // useEffect(() => {
    //   if(!userRole.includes("0") && !userRole.includes("1"))
    //     router.push("/");
    // })

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
    
    const getBackgroundColor = (color, mode) =>
        mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.4);

    const getHoverBackgroundColor = (color, mode) =>
        mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  
    return (
      <Box sx={{
        backgroundColor: `background.base`,
        width: `100vw`,
        height: `100vh`,
        '& .odd-row': {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.background.paper, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) =>
              getHoverBackgroundColor(theme.palette.background.base, theme.palette.mode),
          },
        },
      '& .even-row': {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.info.main, theme.palette.mode),
          '&:hover': {
            bgcolor: (theme) =>
              getHoverBackgroundColor(
                  theme.palette.info.main,
                theme.palette.mode,
              ),
          },
      },}}>
        <CssBaseline />
        <Authorization/>
        <AppBar position="fixed" open={open} sx={{backgroundColor: `background.base`}}>
          <Toolbar>
           <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={open? handleDrawerClose : handleDrawerOpen}
                  edge="start"
                >
              <MenuIcon />
            </IconButton>
            <Typography sx={{paddingLeft: `15px`}} variant="h6" noWrap component="div">
            Hệ thống hỗ trợ quản lý luận văn tốt nghiệp ngành Kỹ thuật phần mềm
            </Typography>
          </Toolbar>
        </AppBar>
      <Box sx={{ display: 'flex', paddingTop: `50px`}}>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
          </DrawerHeader>
          <NavBar open={open} />
        </Drawer>
        <Paper elevation={0} component="main" sx={(theme) => ({
             flexGrow: 1, p: 3, 
             borderRadius: `20px`, 
             height: `calc(100vh - 50px)`, 
             zIndex: theme.zIndex.drawer + 2,
        })}>
            <>
                {children}
            </>
        </Paper>
      </Box>
      </Box>
    )
  }