import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const STORYBLOK_DARK = '#1b243f'
const STORYBLOK_GREEN = '#09b3af'

const typography = {
      subtitle1: {
        fontSize: '2rem',
      },
      subtitle2: {
        fontSize: '2rem',
      },
  } as const

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: STORYBLOK_DARK,
    },
    secondary: {
      main: STORYBLOK_GREEN,
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
          color: STORYBLOK_GREEN
        }
      }
    }
  }
});
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: STORYBLOK_GREEN,
      contrastText: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: STORYBLOK_DARK,
      paper: STORYBLOK_DARK,
    }
  },
  ...typography,
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: STORYBLOK_GREEN
        }
      }
    }
  }
});

export default theme;
