import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: {
        main: '#95978a',
      },
      secondary: {
        main: '#35566E',
      },
      background: {
        primary: '#95978a',
        secondary: '#87edcd',
        base: '#FAF8F8',
        none: `transparent`
      },
      text: {
        dark: '#FFFFFF',
        light: '#443e40'
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  });
