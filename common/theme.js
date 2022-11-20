import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: {
        main: '#87edcd',
      },
      secondary: {
        main: '#95978a',
      },
      background: {
        primary: '#87edcd',
        secondary: '#95978a',
        base: '#FAF8F8',
        none: `transparent`,
        paper: `#FFFFFF`,
      },
      text: {
        dark: '#FFFFFF',
        light: '#443e40'
      },
      error: {
        main: '#f44336'
      },
      success: {
        main: "#87CEEB"
      },
      info: {
        main: '#e8ebe4'
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  });
