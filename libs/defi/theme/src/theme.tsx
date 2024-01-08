import { alpha, createTheme } from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import { FaArrowsRotate, FaCircleCheck } from 'react-icons/fa6';
import { IoCloseCircle } from 'react-icons/io5';
import { RiErrorWarningLine } from 'react-icons/ri';

import { CheckboxIcon } from './components/CheckboxIcon';
import { EmptyCheckbox } from './components/EmptyCheckbox';

const base = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0074F0',
      contrastText: '#FAFBFB',
    },
    secondary: {
      main: '#9869FB',
      contrastText: '#FAFBFB',
    },
    divider: '#282A32',
    background: {
      paper: '#171619',
      default: '#141214',
      header: '#19191D',
      gradientBlue: 'linear-gradient(90deg, #8C66FC -28.99%, #0274F1 144.97%)',
      gradientPurple:
        'linear-gradient(90deg, rgba(179, 97, 230, 0.50) -28.99%, rgba(106, 54, 252, 0.50) 144.97%)',
      gradientOrange: 'linear-gradient(91deg, #FEDBA8 -3.29%, #CF75D5 106.42%)',
    },
    action: {
      hoverOpacity: 0.01,
      disabledOpacity: 0.25,
      disabled: alpha('#FAFBFB', 0.5),
    },
    text: {
      primary: '#FAFBFB',
      secondary: '#B5BECA',
      tertiary: '#828699',
    },
    grey: {
      100: '#FAFBFB',
      200: '#B5BECA',
      300: '#97A0AB',
      400: '#515466',
      500: '#252833',
      600: '#3B3C3E',
      700: '#141519',
      800: '#282A32',
      900: '#18191C',
    },
    success: {
      main: '#66FE90',
    },
    warning: {
      main: '#FFDC86',
    },
    error: {
      main: '#FF4E4E',
    },
  },
});

export const theme = createTheme(base, {
  typography: {
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',

    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    allVariants: {},

    h1: {
      fontFamily: 'Sailec',
      fontSize: 32,
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 1.5,
      [base.breakpoints.down('sm')]: {
        fontSize: 20,
      },
    },
    h3: {
      fontFamily: 'Sailec',
      fontSize: 24,
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 1.5,
      [base.breakpoints.down('sm')]: {
        fontSize: 20,
      },
    },
    h4: {
      fontFamily: 'Sailec',
      fontSize: 20,
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 1.6,
      [base.breakpoints.down('sm')]: {
        fontSize: 18,
        lineHeight: 1.5,
      },
    },
    subtitle1: {
      fontSize: 16,
      color: base.palette.text.secondary,
      [base.breakpoints.down('sm')]: {
        fontSize: 14,
      },
    },
    body1: {
      fontSize: 14,
      lineHeight: 1.5,
      [base.breakpoints.down('sm')]: {
        fontSize: 14,
      },
    },
    body2: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.6,
      fontStyle: 'normal',
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: [
    ...shadows.slice(0, -2),
    '0px 6px 12px 0px rgba(0, 0, 0, 0.20)',
    'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px',
    '0px 1.7955275774002075px 5.32008171081543px 0px rgba(0, 0, 0, 0.03), 0px 6.030803203582764px 17.869047164916992px 0px rgba(0, 0, 0, 0.04), 0px 27px 80px 0px rgba(0, 0, 0, 0.07)',
  ],
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.grey[900],
          border: '1px solid',
          borderColor: theme.palette.grey[800],
          boxShadow: 'none',
          '&:before': {
            height: 0,
          },
          backgroundImage: 'none',
        }),
      },
    },
    MuiAlert: {
      defaultProps: {
        variant: 'standard',
        iconMapping: {
          error: (
            <IoCloseCircle color={base.palette.error.main} fontSize={20} />
          ),
          info: (
            <FaArrowsRotate color={base.palette.success.main} fontSize={20} />
          ),
          success: (
            <FaCircleCheck color={base.palette.success.main} fontSize={20} />
          ),
          warning: (
            <RiErrorWarningLine
              color={base.palette.warning.main}
              fontSize={20}
            />
          ),
        },
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.grey['900'],
          color: theme.palette.text.primary,
          '&&&': { border: 'none' },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          textTransform: 'none',
          borderRadius: 25,
          paddingX: {
            md: 3,
            xs: 2,
          },
          paddingY: {
            md: 1,
            xs: 0.75,
          },
          boxShadow: 'none',
        }),
        containedPrimary: ({ theme }) => ({
          background: `linear-gradient(0deg, ${alpha('#fff', 0.05)} 0%, ${alpha(
            '#fff',
            0.05,
          )} 100%), #1E1F25;`,
          '&:hover': {
            background: theme.palette.background.paper,
          },
        }),
        containedSecondary: ({ theme }) => ({
          background: theme.palette.grey[700],
          '&:hover': {
            background: theme.palette.grey[900],
          },
        }),
        outlinedSecondary: ({ theme }) => ({
          borderColor: theme.palette.divider,
          ':hover': {
            borderColor: theme.palette.primary.main,
          },
        }),
        text: ({ theme }) => ({
          ':hover': {
            color: theme.palette.common.white,
            background: 'transparent',
          },
        }),
      },
      variants: [
        {
          props: { variant: 'action' },
          style: ({ theme }) => ({
            background:
              'linear-gradient(90deg,#8c66fc -28.99%,#0274f1 144.97%)',
            color: theme.palette.text.primary,
            padding: theme.spacing(2),
            fontSize: 20,
            lineHeight: 1.6,
            borderRadius: theme.shape.borderRadius * 2,
            fontFamily: 'Sailec, Inter, Helvetica, Arial, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            '&:hover': {
              background:
                'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(90deg, #8C66FC 0%, #0274F1 100%)',
              opacity: 1,
            },
            '&:disabled': {
              opacity: 0.5,
              color: theme.palette.text.primary,
            },
          }),
        },
      ],
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: 0,
          borderRadius: '8px',
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2.5, 3),
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.header,
          [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1.25, 1.5),
          },
        }),
        title: ({ theme }) => ({
          fontSize: theme.typography.fontSize,
          fontWeight: 500,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2.5, 3),
          [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1.25, 1.5),
          },
        }),
      },
    },
    MuiCheckbox: {
      defaultProps: {
        checkedIcon: <CheckboxIcon />,
        icon: <EmptyCheckbox />,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          ':hover': {
            backgroundColor: 'transparent',
          },
        }),
      },
    },
    MuiCssBaseline: {
      defaultProps: {
        enableColorScheme: true,
      },
      styleOverrides: `
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;            
          }

          input[type=number] {
            -moz-appearance: textfield;
          }

          input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `,
    },
    MuiDialog: {
      defaultProps: {
        transitionDuration: 0,
        disableScrollLock: true,
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius * 2,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          py: 3,
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.75,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: ({ theme }) => ({ color: theme.palette.text.primary }),
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          position: 'static',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.MuiInputLabel-root': {
            position: 'static',
            transform: 'none',
            transformOrigin: 'initial',
            fontSize: theme.typography.fontSize,
            marginBlockEnd: theme.spacing(1),
            color: `${theme.palette.text.primary}`,
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `liear-gradient(0deg, ${alpha('#fff', 0.05)} 0%, ${alpha(
            '#fff',
            0.05,
          )} 100%), #1E1F25;`,
          '&:hover': {
            background: theme.palette.background.paper,
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 20,
          border: '1px solid',
          borderColor: theme.palette.info.main,
          backgroundColor: theme.palette.background.default,
          width: 'auto',
          paddingBlock: theme.spacing(0.5),
          paddingInline: theme.spacing(1.5),

          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
            fontSize: theme.typography.fontSize,
          },
        }),
        input: ({ theme }) => ({
          padding: theme.spacing(0.5),
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          color: theme.palette.text.primary,
          textDecoration: 'none',
        }),
      },
    },
    MuiMenu: {
      defaultProps: {
        transitionDuration: 0,
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          border: '1px solid',
          borderColor: theme.palette.background.default,
        }),
        list: {
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.grey[800],
            },
          },
          '&:hover': {
            backgroundColor: theme.palette.grey[800],
          },
        }),
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
          '&.Mui-selected': {
            background: theme.palette.background.paper,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        transitionDuration: 0,
        disableScrollLock: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: theme.shadows[23],
          backgroundImage: 'none',
          borderRadius: theme.shape.borderRadius * 2.5,
          background: 'transparent',
        }),
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },
      styleOverrides: {
        text: ({ theme }) => ({
          borderRadius: 10,
          // backgroundColor: theme.palette.grey[900],
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 0,
          padding: theme.spacing(3, 2),
          fontSize: 16,
          textTransform: 'none',
          lineHeight: 1.6875,
          ':hover': {
            color: theme.palette.text.primary,
          },
          '&.Mui-selected': {
            color: theme.palette.text.primary,
          },
          [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1, 2),
          },
          [theme.breakpoints.down('sm')]: {
            fontSize: 14,
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingInline: theme.spacing(3),
          paddingBlock: theme.spacing(2),
          fontSize: theme.typography.fontSize,
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 1.6,
        }),
        head: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) => ({
          background: 'linear-gradient(90deg, #8C66FC 0%, #0274F1 100%)',
          transition: theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.easeInOut,
          }),
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          paddingInline: theme.spacing(2),
          paddingBlock: theme.spacing(1.5),
          borderRadius: theme.shape.borderRadius * 2,
          border: '1px solid',
          borderColor: theme.palette.grey[500],
          boxShadow: theme.shadows[23],
        }),
      },
    },
  },
  mixins: {
    toolbar: {
      height: 75,
    },
  },
});
