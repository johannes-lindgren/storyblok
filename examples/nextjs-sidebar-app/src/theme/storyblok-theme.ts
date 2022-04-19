import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import {color_primary, color_secondary} from "@src/theme/design-tokens";

const typography = {
      subtitle1: {
        fontSize: '2rem',
      },
      subtitle2: {
        fontSize: '2rem',
      },
  } as const

// Create a theme instance.
const storyblokTheme = createTheme({
  palette: {
    primary: {
      main: color_primary,
    },
    secondary: {
      main: color_secondary,
      contrastText: '#ffffff',
    },
    error: {
      main: red.A400,
    },
  },
  ...typography,
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: color_primary
        }
      }
    }
  }
});

export default storyblokTheme;
