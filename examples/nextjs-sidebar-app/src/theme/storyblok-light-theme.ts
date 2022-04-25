import {createTheme} from '@mui/material/styles';
import {
    base_border_radius,
    black,
    blue,
    color_negative,
    color_positive,
    color_primary, color_primary_dark,
    color_warning,
    font_14, font_16, font_weight_bold, font_weight_light,
    font_weight_medium, font_weight_regular, heading_base, heading_lg, heading_md, heading_s, heading_xl, heading_xs,
    light,
    light_25,
    light_50,
    light_gray,
    sb_dark_blue,
    sb_dark_blue_50,
    white
} from "@src/theme/design-tokens";
import {TypographyOptions} from "@mui/material/styles/createTypography";
import {Shadows} from "@mui/material/styles/shadows";
import {alpha} from "@mui/material";

const typography: TypographyOptions = ({
    // fontSize: 10,
    fontWeightLight: font_weight_light,
    fontWeightRegular: font_weight_regular,
    fontWeightMedium: font_weight_medium,
    fontWeightBold: font_weight_bold,
    h1: {
        margin: 0,
        padding: 0,
        fontWeight: font_weight_medium,
        letterSpacing: 0,
        fontSize: heading_xl,
    },
    h2: {
        fontSize: heading_lg,
    },
    h3: {
        fontSize: heading_md,
    },
    h4: {
        fontSize: heading_base,
    },
    h5: {
        fontSize: heading_s,
    },
    h6: {
        fontSize: heading_xs,
    },
    subtitle1: {
        fontSize: font_16,
    },
    subtitle2: {
        fontSize: font_16,
    },
    button: {
        fontSize: font_14,
        fontWeight: font_weight_medium,
        textTransform: 'inherit',
        //     TODO padding 8px 16px
    },
})

const shadows = [
    'none',
    ...(new Array(24)
        .fill(0)
        .map((_, i) => i + 1)
        .map(i => [
            0,
            i/12,
            i,
            i/4
        ])
        .map(v => v.map(Math.ceil))
        .map(v => `${v[0]}px ${v[1]}px ${v[2]}px ${v[3]}px ${alpha(sb_dark_blue, 0.07)}`))
] as Shadows

// Create a theme instance.
const storyblokLightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: color_primary,
        },
        secondary: {
            // main: color_secondary,
            main: color_primary_dark,
            contrastText: '#ffffff',
        },
        success: {
            main: color_positive,
        },
        info: {
            main: blue,
        },
        warning: {
            main: color_warning,
        },
        error: {
            main: color_negative,
        },
        background: {
            default: light_25,
            paper: white,
        },
        common: {
            white: white,
            black: black,
        },
        text: {
            primary: sb_dark_blue,
            secondary: sb_dark_blue_50,
            disabled: light_50,
        },
        divider: light_50,
        action: {
            focus: color_primary,
            focusOpacity: 1,
            active: light,
            activatedOpacity: 0.5,
            disabled: light_gray,
            disabledBackground: light,
            // disabledOpacity: 1,
            hover: light,
            hoverOpacity: 0.25,
            selected: color_primary,
            // selectedOpacity: 1,
        },
        grey: {
            "50": "#F4F8FF",
            "100": "#ECF0FF",
            "200": "#E2E6F5",
            "300": "#D1D5E4",
            "400": "#ADB1C0",
            "500": "#8d919f",
            "600": "#656976",
            "700": "#525662",
            "800": "#343743",
            "900": "#141822",
        }
    },
    shape: {
        borderRadius: base_border_radius,
    },
    transitions: {
        // duration: base_transition_duration,
        // easing: base_transition_easing,
    },
    shadows,
    // shadows: TODO
    typography,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                mark: {
                    color: white,
                    backgroundColor: color_primary,
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: color_primary
                }
            }
        }
    }
});

// TODO dark theme (replicate the side nav in the storyblok application)

export default storyblokLightTheme;
