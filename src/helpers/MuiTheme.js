import ColorConvert from 'color-convert';

import { createMuiTheme } from '@material-ui/core/styles';

import theme from 'shared/theme';

export const BliksideTheme = createMuiTheme({
	props: {
		MuiButtonBase: {
			disableRipple: true,
		},
	},
	palette: {
		primary: {
			main: theme.teal.cT300,
			light: theme.teal.cT200,
			dark: theme.teal.cT400,
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
			color: theme.blueGrey.cBg700,
			fontSize: 92,
		},
		h2: {
			color: theme.blueGrey.cBg700,
			fontSize: 56,
		},
		h3: {
			color: theme.blueGrey.cBg700,
			fontSize: 44,
		},
		h4: {
			color: theme.blueGrey.cBg700,
			fontSize: 30,
		},
		h5: {
			color: theme.blueGrey.cBg700,
			fontSize: 20,
		},
		h6: {
			color: theme.blueGrey.cBg600,
			fontSize: 16,
		},
		subtitle1: {
			color: theme.blueGrey.cBg700,
			fontSize: 14,
		},
		subtitle2: {
			color: theme.blueGrey.cBg700,
			fontSize: 13,
		},
		body1: {
			color: theme.blueGrey.cBg600,
			fontSize: 14,
		},
		body2: {
			color: theme.blueGrey.cBg600,
			fontSize: 13,
			lineHeight: 1.4,
		},
		caption: {
			color: theme.blueGrey.cBg300,
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
				backgroundColor: theme.brightness.cBr5,
			},
		},
		MuiTooltip: {
			tooltip: {
				backgroundColor: theme.slateGrey.cSg3,
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
			elevation1: {
				boxShadow: `0 1px 3px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 1px 1px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 2px 1px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation2: {
				boxShadow: `0 1px 5px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation3: {
				boxShadow: `0 1px 8px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 3px 4px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 3px 3px -2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation4: {
				boxShadow: `0 2px 4px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 4px 5px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 1px 10px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation5: {
				boxShadow: `0 3px 5px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 5px 8px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 1px 14px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation6: {
				boxShadow: `0 3px 5px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 6px 10px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 1px 18px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation7: {
				boxShadow: `0 4px 5px -2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 7px 10px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 2px 16px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation8: {
				boxShadow: `0 5px 5px -3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 8px 10px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 3px 14px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation9: {
				boxShadow: `0 5px 6px -3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 9px 12px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 3px 16px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation10: {
				boxShadow: `0 6px 6px -3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 10px 14px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 4px 18px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation11: {
				boxShadow: `0 6px 7px -4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 11px 15px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 4px 20px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation12: {
				boxShadow: `0 7px 8px -4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 12px 17px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 5px 22px 4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation13: {
				boxShadow: `0 7px 8px -4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 13px 19px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 5px 24px 4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation14: {
				boxShadow: `0 7px 9px -4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 14px 21px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 5px 26px 4px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation15: {
				boxShadow: `0 8px 9px -5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 15px 22px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 6px 28px 5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation16: {
				boxShadow: `0 8px 10px -5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 16px 24px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 6px 30px 5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation17: {
				boxShadow: `0 8px 11px -5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 17px 26px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 6px 32px 5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation18: {
				boxShadow: `0 9px 11px -5px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 18px 28px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 7px 34px 6px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation19: {
				boxShadow: `0 9px 12px -6px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 19px 29px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 7px 36px 6px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation20: {
				boxShadow: `0 10px 13px -6px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 20px 31px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 8px 38px 7px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation21: {
				boxShadow: `0 10px 13px -6px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 21px 33px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 8px 40px 7px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation22: {
				boxShadow: `0 10px 14px -6px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 22px 35px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 8px 42px 7px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation23: {
				boxShadow: `0 11px 14px -7px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 23px 36px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 9px 44px 8px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
			elevation24: {
				boxShadow: `0 11px 15px -7px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2),
					0 24px 38px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14),
					0 9px 46px 8px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
			},
		},
		MuiList: {
			padding: {
				paddingTop: 6,
				paddingBottom: 6,
			},
		},
		MuiListItem: {
			button: {
				transition: 'background-color 150ms ease-out',
				'&:hover': {
					backgroundColor: theme.blueGrey.cBg50,
				},
			},
			root: {
				'&$selected': {
					backgroundColor: theme.blueGrey.cBg100,
					'&:hover': {
						backgroundColor: theme.blueGrey.cBg100,
					},
				},
			},
		},
		MuiMenuItem: {
			root: {
				color: theme.blueGrey.cBg700,
				fontSize: 14,
				minHeight: 34,
				lineHeight: 1.6,
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
					color: theme.blueGrey.cBg400,
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
				color: theme.blueGrey.cBg400,
				fontSize: 13,
				fontWeight: 500,
				lineHeight: 1.3,
				'&$focused': {
					color: null,
				},
				'&$disabled': {
					color: theme.blueGrey.cBg400,
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
				color: theme.blueGrey.cBg200,
				borderRadius: 8,
				fontWeight: 600,
				letterSpacing: 0.25,
				textTransform: null,
				transition:
					'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				'&:hover': {
					backgroundColor: theme.blueGrey.cBg50,
				},
			},
			label: {
				'$text &': {
					color: theme.blueGrey.cBg600,
				},
				'$outlined &': {
					color: theme.blueGrey.cBg400,
				},
				'$outlinedPrimary &': {
					color: theme.teal.cT300,
				},
			},
			contained: {
				'&$disabled': {
					backgroundColor: theme.brightness.cBr4,
					color: theme.blueGrey.cBg300,
					'&:hover': {
						backgroundColor: theme.brightness.cBr4,
					},
				},
			},
			containedPrimary: {
				boxShadow: [
					`0 2px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.25)`,
					`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.14)`,
					`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.12)`,
				].join(),
				'&:active': {
					boxShadow: [
						`0 5px 5px -3px rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.25)`,
						`0 8px 10px 1px rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.14)`,
						`0 3px 14px 2px rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.12)`,
					].join(),
				},
			},
			outlined: {
				color: `rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg100)}, 0.8)`,
				'&:hover': {
					backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg300)}, 0.08)`,
				},
			},
			outlinedPrimary: {
				color: `rgba(${ColorConvert.hex.rgb(theme.teal.cT100)}, 0.8)`,
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
					marginTop: 21,
				},
			},
		},
		MuiInputBase: {
			root: {
				color: theme.blueGrey.cBg700,
				fontSize: 13,
				'&$disabled': {
					color: theme.blueGrey.cBg500,
				},
				'&$focused:not($error)': {
					'& $input:not([readonly])': {
						boxShadow: `0 0 0 2px ${theme.teal.cT300} inset`,
					},
				},
				'&$error': {
					'& $input:not([readonly])': {
						boxShadow: `0 0 0 2px ${theme.other[0]} inset`,
					},
				},
			},
			input: {
				backgroundColor: theme.brightness.cBr4,
				borderRadius: 5,
				boxShadow: `0 0 0 2px ${theme.brightness.cBr5} inset`,
				boxSizing: 'border-box',
				minHeight: 36,
				padding: '5px 10px',
				transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out',
				'&[readonly]': {
					backgroundColor: 'transparent',
					boxShadow: 'none',
					padding: '5px 10px',
					'.none-padding &': {
						padding: 0,
					},
				},
				'&$disabled': {
					backgroundColor: theme.brightness.cBr3,
					boxShadow: 'none',
				},
			},
			inputMultiline: {
				padding: '10px',
				'&[readonly]': {
					padding: '10px',
				},
			},
		},
		MuiSelect: {
			select: {
				borderRadius: 5,
				minHeight: 36,
				padding: '11px 25px 9px 10px',
				'&:focus': {
					background: theme.brightness.cBr5,
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
				color: theme.brightness.cBr1,
				height: 16,
				width: 44,
			},
			bar: {
				backgroundColor: theme.blueGrey.cBg500,
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
					`0 2px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.25)`,
					`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.14)`,
					`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal.cT600)}, 0.12)`,
				].join(),
			},
		},
		MuiRadio: {
			root: {
				color: `rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg300)}, 0.5)`,
				padding: 10,
				'& svg': {
					height: 20,
					width: '20px !important',
				},
			},
		},
		PrivateSwitchBase: {
			root: {
				padding: '7px 10px',
			},
		},
		MuiCheckbox: {
			root: {
				color: theme.blueGrey.cBg200,
				'& svg': {
					width: '18px !important',
				},
			},
			colorPrimary: {
				'&$disabled': {
					color: theme.blueGrey.cBg100,
				},
			},
		},
		MuiDialog: {
			scrollBody: {
				overflowX: 'auto',
			},
			paperWidthXs: {
				maxWidth: 'none !important',
				width: 320,
			},
			paperWidthSm: {
				maxWidth: 'none !important',
				width: 420,
			},
			paperWidthMd: {
				maxWidth: 'none !important',
				width: 520,
			},
			paperWidthLg: {
				maxWidth: 'none !important',
				width: 660,
			},
			paperWidthXl: {
				maxWidth: 'none !important',
				width: 990,
			},
			paper: {
				margin: 20,
				'.pd-dialog_sticky-actions &': {
					overflowY: 'initial',
				},
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
				color: theme.blueGrey.cBg500,
			},
		},
		MuiTableCell: {
			head: {
				borderBottomColor: theme.brightness.cBr5,
				color: theme.blueGrey.cBg300,
				fontSize: 14,
				lineHeight: 1.3,
				paddingTop: 18,
				paddingBottom: 18,
			},
			body: {
				color: theme.blueGrey.cBg700,
				borderBottomColor: theme.brightness.cBr4,
			},
		},
	},
});
