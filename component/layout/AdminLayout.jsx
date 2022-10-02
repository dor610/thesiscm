import { ListItem, ListItemIcon, ListItemText, Box, Paper, Tooltip, IconButton } from "@mui/material";

import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiBox from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn } from "../../features/userSlice";
import { isLoggedIn } from "../../common/utils";
import NavBar from "../admin/NavBar";

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
    '& .css-12i7wg6-MuiPaper-root-MuiDrawer-paper': {
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

export default function AdminLayout({children}) {

    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
    const currentPage = useSelector(state => state.path.currentPage);
    const previousPage = useSelector(state => state.path.previousPage);
    const [open, setOpen] = useState(true);

    useEffect(() =>{
      if(!isUserLoggedIn) {
        if(!isLoggedIn()){
          router.push("/login");
        }else {
          dispatch(setIsLoggedIn(true));
        }
      }
    }, [isUserLoggedIn, router, dispatch]);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const generateMenuList = () =>{

    }
  
    return (
      <Box sx={{
        backgroundColor: `background.base`,
        width: `100vw`,
        height: `100vh`}}>
        <CssBaseline />
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
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
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