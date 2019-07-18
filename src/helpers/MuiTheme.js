import { createMuiTheme } from '@material-ui/core/styles';

import colorPalette from 'shared/colorPalette';

import { hexToRgb } from './utils';

export const BliksideTheme = createMuiTheme({
	palette: {
		primary: {
			main: colorPalette.teal.cT300,
			light: colorPalette.teal.cT200,
			dark: colorPalette.teal.cT400,
			contrastText: '#FFF',
		},
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		useNextVariants: true,
		fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica, Segoe, sans-serif',
		h1: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 92,
		},
		h2: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 56,
		},
		h3: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 44,
		},
		h4: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 30,
		},
		h5: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 20,
		},
		h6: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 16,
		},
		subtitle1: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 14,
		},
		subtitle2: {
			color: colorPalette.blueGrey.cBg700,
			fontSize: 13,
		},
		body1: {
			color: colorPalette.blueGrey.cBg600,
			fontSize: 14,
		},
		body2: {
			color: colorPalette.blueGrey.cBg600,
			fontSize: 13,
			lineHeight: 1.4,
		},
		caption: {
			color: colorPalette.blueGrey.cBg300,
			fontSize: 14,
			lineHeight: 1.3,
		},
	},
	overrides: {
		MuiTypography: {
			gutterBottom: {
				marginBottom: 10,
			},
		},
		MuiDivider: {
			root: {
				backgroundColor: colorPalette.brightness.cBr5,
			},
		},
		MuiTooltip: {
			tooltip: {
				backgroundColor: colorPalette.slateGrey.cSg3,
				borderRadius: 5,
				fontSize: 12,
				lineHeight: 1.2,
			},
			tooltipPlacementLeft: {
				margin: '0 10px',
				'@media (min-width: 600px)': {
					margin: '0 10px',
				},
			},
			tooltipPlacementRight: {
				margin: '0 10px',
				'@media (min-width: 600px)': {
					margin: '0 10px',
				},
			},
			tooltipPlacementTop: {
				margin: '10px 0',
				'@media (min-width: 600px)': {
					margin: '10px 0',
				},
			},
			tooltipPlacementBottom: {
				margin: '10px 0',
				'@media (min-width: 600px)': {
					margin: '10px 0',
				},
			},
		},
		MuiPaper: {
			elevation2: {
				boxShadow:
					'0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -6px rgba(0, 0, 0, 0.12)',
			},
		},
		MuiListItem: {
			button: {
				'&:hover': {
					backgroundColor: colorPalette.blueGrey.cBg50,
				},
			},
			root: {
				'&$selected': {
					backgroundColor: colorPalette.blueGrey.cBg100,
					'&:hover': {
						backgroundColor: colorPalette.blueGrey.cBg100,
					},
				},
			},
		},
		MuiMenuItem: {
			root: {
				color: colorPalette.blueGrey.cBg700,
				fontSize: 14,
				minHeight: 36,
				lineHeight: 1.2,
				padding: '6px 10px',
			},
			gutters: {
				paddingLeft: 10,
				paddingRight: 10,
			},
		},
		MuiFormGroup: {
			row: {
				'& > label': {
					marginRight: 16,
				},
			},
		},
		MuiFormControl: {
			marginNormal: {
				marginBottom: 20,
				marginTop: 0,
			},
			marginDense: {
				marginBottom: 10,
				marginTop: 0,
			},
		},
		MuiFormControlLabel: {
			root: {
				marginLeft: -10,
				marginRight: 0,
			},
			label: {
				userSelect: 'none',
				'&$disabled': {
					color: colorPalette.blueGrey.cBg400,
				},
			},
		},
		MuiFormHelperText: {
			root: {
				fontSize: 13,
				lineHeight: 1.2,
				marginLeft: 2,
			},
		},
		MuiFormLabel: {
			root: {
				color: colorPalette.blueGrey.cBg400,
				fontSize: 13,
				fontWeight: 500,
				'&$focused': {
					color: null,
				},
				'&$disabled': {
					color: colorPalette.blueGrey.cBg400,
				},
			},
		},
		MuiInputLabel: {
			shrink: {
				transform: 'translate(0, 0)',
			},
		},
		MuiButton: {
			root: {
				color: colorPalette.blueGrey.cBg200,
				borderRadius: 8,
				fontWeight: 600,
				letterSpacing: 0.25,
				textTransform: null,
				transition:
					'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				'&:hover': {
					backgroundColor: colorPalette.blueGrey.cBg50,
				},
			},
			label: {
				'$text &': {
					color: colorPalette.blueGrey.cBg600,
				},
				'$outlined &': {
					color: colorPalette.blueGrey.cBg400,
				},
				'$outlinedPrimary &': {
					color: colorPalette.teal.cT300,
				},
			},
			contained: {
				'&$disabled': {
					backgroundColor: colorPalette.brightness.cBr4,
					color: colorPalette.blueGrey.cBg300,
					'&:hover': {
						backgroundColor: colorPalette.brightness.cBr4,
					},
				},
			},
			containedPrimary: {
				boxShadow: [
					`0 2px 5px 0 rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.25)`,
					`0 2px 2px 0 rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.14)`,
					`0 3px 1px -2px rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.12)`,
				].join(),
				'&:active': {
					boxShadow: [
						`0 5px 5px -3px rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.25)`,
						`0 8px 10px 1px rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.14)`,
						`0 3px 14px 2px rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.12)`,
					].join(),
				},
			},
			outlined: {
				color: `rgba(${hexToRgb(colorPalette.blueGrey.cBg100)}, 0.8)`,
				'&:hover': {
					backgroundColor: `rgba(${hexToRgb(colorPalette.blueGrey.cBg300)}, 0.08)`,
				},
			},
			outlinedPrimary: {
				color: `rgba(${hexToRgb(colorPalette.teal.cT100)}, 0.8)`,
			},
		},
		MuiInput: {
			underline: {
				'&:before': {
					content: null,
				},
				'&:after': {
					content: null,
				},
			},
			formControl: {
				'label + &': {
					marginTop: 19,
				},
			},
		},
		MuiInputBase: {
			root: {
				color: colorPalette.blueGrey.cBg700,
				fontSize: 13,
				'&$disabled': {
					color: colorPalette.blueGrey.cBg400,
				},
				'&$focused:not($error)': {
					'& $input:not([readonly])': {
						boxShadow: `0 0 0 2px ${colorPalette.teal.cT300} inset`,
					},
				},
				'&$error': {
					'& $input:not([readonly])': {
						boxShadow: '0 0 0 2px #f44336 inset',
					},
				},
			},
			input: {
				backgroundColor: colorPalette.brightness.cBr4,
				borderRadius: 5,
				boxSizing: 'border-box',
				minHeight: 36,
				padding: '5px 10px',
				transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out',
				'&:hover': {
					boxShadow: `0 0 0 2px ${colorPalette.brightness.cBr5} inset`,
				},
				'&[readonly]': {
					backgroundColor: 'transparent',
					boxShadow: 'none',
					padding: '5px 10px',
				},
				'&$disabled': {
					'&:hover': {
						boxShadow: 'none',
					},
				},
			},
		},
		MuiSelect: {
			select: {
				borderRadius: 5,
				minHeight: 36,
				padding: '10px 25px 10px 10px',
				'&:focus': {
					background: colorPalette.brightness.cBr5,
					borderRadius: null,
				},
			},
			selectMenu: {
				minHeight: 36,
			},
		},
		MuiSwitch: {
			root: {
				width: 58,
			},
			switchBase: {
				color: colorPalette.brightness.cBr1,
				height: 16,
				width: 44,
			},
			bar: {
				backgroundColor: colorPalette.blueGrey.cBg500,
				height: 10,
				marginLeft: -15,
				marginTop: -4,
				opacity: 0.26,
				width: 30,
			},
			icon: {
				boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.24)',
				height: 16,
				width: 16,
			},
			iconChecked: {
				boxShadow: [
					`0 2px 5px 0 rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.25)`,
					`0 2px 2px 0 rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.14)`,
					`0 3px 1px -2px rgba(${hexToRgb(colorPalette.teal.cT600)}, 0.12)`,
				].join(),
			},
		},
		MuiRadio: {
			root: {
				color: `rgba(${hexToRgb(colorPalette.blueGrey.cBg300)}, 0.5)`,
				padding: 10,
				'& svg': {
					height: 20,
					width: '20px !important',
				},
			},
		},
		PrivateSwitchBase: {
			root: {
				padding: '9px 10px',
			},
		},
		MuiCheckbox: {
			root: {
				color: colorPalette.blueGrey.cBg200,
				'& svg': {
					width: '18px !important',
				},
			},
			colorPrimary: {
				'&$disabled': {
					color: colorPalette.blueGrey.cBg100,
				},
			},
		},
		MuiDialog: {
			paperWidthXs: {
				maxWidth: 320,
			},
			paperWidthSm: {
				maxWidth: 400,
			},
			paperWidthMd: {
				maxWidth: 480,
			},
			paperWidthLg: {
				maxWidth: 600,
			},
			paperWidthXl: {
				maxWidth: 990,
			},
			paper: {
				margin: 20,
			},
			paperScrollPaper: {
				maxHeight: 'calc(100% - 40px)',
			},
		},
		MuiDialogTitle: {
			root: {
				padding: '17px 20px',
			},
		},
		MuiDialogContent: {
			root: {
				padding: '25px 25px 30px',
				'&:first-child': {
					paddingTop: null,
				},
			},
		},
		MuiDialogContentText: {
			root: {
				color: colorPalette.blueGrey.cBg500,
			},
		},
	},
});
