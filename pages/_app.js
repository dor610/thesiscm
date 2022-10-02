import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from "../common/theme";
import { CssBaseline, Paper, ThemeProvider } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import DefaultLayout from '../component/layout/DefaultLayout';

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline/>
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
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
