import {createMuiTheme} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(167, 187, 199)',
        },
        secondary: {
            main: 'rgb(218, 127, 144)',
        },
        info: {
            light: 'rgb(251, 243, 243)',
            main: 'rgb(226, 229, 234)',
        },
        error: {
            main: 'rgb(218, 127, 144)'
        },
        success: {
            main: 'rgb(167, 187, 199)'
        },
        test: {
            primary: 'rgb(68, 71, 73)',
            secondary: 'rgb(251, 243, 243)'
        }
    },
});

export default theme;