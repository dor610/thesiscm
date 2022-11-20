import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from "../common/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DefaultLayout from '../component/layout/DefaultLayout';
import WebSocket from '../component/layout/WebSocket';
import Authorization from '../component/layout/Authorization';

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline/>
        <WebSocket/>
        <Authorization/>
        <Layout>
        <Component {...pageProps} />
        </Layout>
        <div style={{zIndex: 1000}}>
          <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
        </div>
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
