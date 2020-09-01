import React from 'react';
import ColorConvert from 'color-convert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';

import theme from 'shared/theme';

export default createMuiTheme({
	overrides: {
		MuiContainer: {
			root: {
				paddingLeft: null,
				paddingRight: null,
				'@media (min-width: 600px)': {
					paddingLeft: 0,
					paddingRight: 0,
				},
				'@media (min-width: 960px)': {
					paddingLeft: 0,
					paddingRight: 0,
				},
			},
		},
		MuiTypography: {
			gutterBottom: {
				marginBottom: '0.65rem',
			},
		},
		MuiTooltip: {
			tooltip: {
				backgroundColor: 'white',
				borderRadius: 8,
				color: theme.blueGrey['700'],
				fontSize: 13,
				fontWeight: 400,
				lineHeight: 1.4,
				maxWidth: null,
				boxShadow: `0 0 11px -5px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.2),
					0 0 28px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.14),
					0 0 34px 6px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.12)`,
				padding: '12px 15px',
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
			arrow: {
				color: null,
				fontSize: null,
			},
			popperArrow: {
				'&[x-placement*="bottom"] $arrow': {
					background: 'url(/img/arrow/arrow_bottom.svg) no-repeat center center',
					marginTop: -12,
					height: 12,
					width: 20,
					'&:before': {
						display: 'none',
					},
				},
				'&[x-placement*="top"] $arrow': {
					background: 'url(/img/arrow/arrow_top.svg) no-repeat center center',
					marginBottom: -12,
					height: 12,
					width: 20,
					'&:before': {
						display: 'none',
					},
				},
				'&[x-placement*="right"] $arrow': {
					background: 'url(/img/arrow/arrow_right.svg) no-repeat center center',
					marginLeft: -12,
					height: 20,
					width: 12,
					'&:before': {
						display: 'none',
					},
				},
				'&[x-placement*="left"] $arrow': {
					background: 'url(/img/arrow/arrow_left.svg) no-repeat center center',
					marginRight: -12,
					height: 20,
					width: 12,
					'&:before': {
						display: 'none',
					},
				},
			},
		},
		MuiPaper: {
			root: {
				color: theme.blueGrey['700'],
			},
		},
		MuiList: {
			padding: {
				paddingLeft: '8px',
				paddingRight: '8px',
			},
		},
		MuiListItem: {
			root: {
				'&$selected, &$selected:hover': {
					backgroundColor: null,
					fontWeight: 600,
				},
			},
			button: {
				transition: 'background-color 50ms ease-out',
				'&:hover, &$focusVisible:hover': {
					backgroundColor: theme.blueGrey['50'],
				},
				'&$focusVisible': {
					backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.blueGrey['50'])}, 0.5)`,
				},
			},
		},
		MuiMenuItem: {
			root: {
				color: theme.blueGrey.cBg700,
				borderRadius: 4,
				fontSize: 13,
				minHeight: 34,
				lineHeight: 1.6,
				whiteSpace: null,
			},
			gutters: {
				paddingLeft: 8,
				paddingRight: 8,
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
			root: {
				verticalAlign: null,
			},
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
				marginLeft: -9,
				marginRight: 0,
			},
			label: {
				userSelect: 'none',
				'&$disabled': {
					color: null,
				},
			},
			labelPlacementStart: {
				marginLeft: 0,
				marginRight: -9,
			},
		},
		MuiFormHelperText: {
			root: {
				fontSize: 13,
				lineHeight: 1.3,
				marginLeft: 2,
				'&$disabled': {
					color: null,
				},
			},
		},
		MuiFormLabel: {
			root: {
				color: theme.blueGrey['400'],
				fontSize: 13,
				fontWeight: 500,
				lineHeight: 1.3,
				'&$focused': {
					color: null,
				},
				'&$disabled': {
					color: theme.blueGrey['300'],
				},
			},
		},
		MuiInputLabel: {
			root: {
				'&[data-inline]': {
					alignItems: 'center',
					display: 'flex',
					flex: '0 0 auto',
					marginRight: 10,
					marginTop: 10,
				},
			},
			formControl: {
				marginBottom: 5,
				top: null,
				left: null,
				position: null,
				transform: null,
				// '[readonly] &': {
				// 	marginBottom: 0,
				// },
			},
			shrink: {
				transform: 'translate(0, 0)',
			},
		},
		MuiButton: {
			root: {
				color: theme.blueGrey['200'],
				borderRadius: 8,
				fontWeight: 600,
				letterSpacing: 0.25,
				textTransform: null,
				transition:
					'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				'&:hover': {
					backgroundColor: theme.blueGrey['50'],
				},
			},
			label: {
				'$text &': {
					color: theme.blueGrey['600'],
				},
				'$outlined &': {
					color: theme.blueGrey['400'],
				},
				'$outlinedPrimary &': {
					color: theme.teal['300'],
				},
				'& .loading-button-label': {
					transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
				},
			},
			text: {
				padding: '6px 12px',
			},
			contained: {
				backgroundColor: theme.blueGrey['50'],
				color: theme.blueGrey['600'],
				boxShadow: null,
				'&:hover': {
					backgroundColor: theme.blueGrey['100'],
					boxShadow: null,
				},
				'&:active': {
					boxShadow: null,
				},
				'&$disabled': {
					backgroundColor: theme.brightness['4'],
					color: theme.blueGrey['300'],
					'&:hover': {
						backgroundColor: theme.brightness['4'],
					},
				},
				'&$focusVisible': {
					boxShadow: null,
				},
			},
			containedPrimary: {
				boxShadow: [
					`0 1px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.2)`,
					`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
					`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
				].join(),
				'&:hover': {
					boxShadow: [
						`0 2px 4px -1px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.2)`,
						`0 4px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
						`0 1px 10px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
					].join(),
				},
				'&:active': {
					boxShadow: [
						`0 1px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.2)`,
						`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
						`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
					].join(),
				},
			},
			outlined: {
				color: `rgba(${ColorConvert.hex.rgb(theme.blueGrey['100'])}, 0.8)`,
				borderColor: theme.blueGrey['100'],
				'&:hover': {
					backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.blueGrey['300'])}, 0.08)`,
				},
				'&$disabled': {
					border: null,
					color: null,
					opacity: 0.7,
				},
			},
			outlinedPrimary: {
				color: `rgba(${ColorConvert.hex.rgb(theme.teal['100'])}, 0.8)`,
			},
			iconSizeSmall: {
				'& > *:first-child': {
					fontSize: 14,
				},
			},
			iconSizeMedium: {
				'& > *:first-child': {
					fontSize: 16,
				},
			},
		},
		MuiButtonGroup: {
			contained: {
				boxShadow: [
					`0 1px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.2)`,
					`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
					`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
				].join(),
				'&:hover': {
					boxShadow: [
						`0 2px 4px -1px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.2)`,
						`0 4px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
						`0 1px 10px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
					].join(),
				},
				'&:active': {
					boxShadow: [
						`0 1px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.2)`,
						`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
						`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
					].join(),
				},
			},
		},
		MuiToggleButton: {
			root: {
				color: theme.blueGrey['400'],
				border: `1px solid ${theme.brightness['5']}`,
				transition:
					'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				textTransform: 'initial',
				'&:hover': {
					backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.blueGrey['300'])}, 0.08)`,
				},
				'&$selected': {
					color: theme.blueGrey['500'],
					backgroundColor: theme.brightness['5'],
					'&:hover': {
						backgroundColor: theme.brightness['5'],
					},
				},
				'&$selected:not($disabled)': {
					color: 'white',
					backgroundColor: theme.teal['300'],
					borderColor: theme.teal['300'],
					'&:hover': {
						backgroundColor: theme.teal['300'],
					},
				},
				'&$disabled': {
					color: theme.blueGrey['400'],
					borderColor: theme.blueGrey['50'],
				},
				'&.Mui-focusVisible': {
					boxShadow: `0 0 0 2px ${theme.teal['100']}`,
					zIndex: 1,
				},
			},
			sizeSmall: {
				height: 36,
			},
		},
		MuiIconButton: {
			root: {
				color: theme.blueGrey['300'],
				fontSize: 20,
				height: 32,
				transition:
					'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				width: 32,
				'&.activeAction, &:hover': {
					backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.blueGrey['100'])}, 0.2)`,
					color: theme.blueGrey['500'],
				},
				'&.positiveAction.activeAction, &.positiveAction:hover': {
					backgroundColor: theme.teal['50'],
					color: theme.teal['400'],
				},
				'&.destructiveAction.activeAction, &.destructiveAction:hover': {
					backgroundColor: theme.red['50'],
					color: theme.red['500'],
				},
				'&$disabled': {
					color: theme.blueGrey['200'],
				},
			},
			sizeSmall: {
				height: 24,
				fontSize: 16,
				width: 24,
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
					marginTop: null,
				},
			},
		},
		MuiInputBase: {
			root: {
				backgroundColor: theme.brightness['4'],
				borderRadius: 5,
				boxShadow: `0 0 0 2px ${theme.brightness['5']} inset`,
				boxSizing: 'border-box',
				color: theme.blueGrey['700'],
				fontSize: 13,
				lineHeight: 1.3,
				minHeight: 36,
				transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out',
				'[readonly] > &, [readonly] > &$focused:not($error)': {
					backgroundColor: 'transparent',
					boxShadow: 'none',
					'& $input': {
						height: 36,
						padding: 0,
					},
				},
				'&$disabled': {
					color: theme.blueGrey['600'],
					backgroundColor: theme.brightness['3'],
					boxShadow: 'none',
				},
				'&$focused:not($error)': {
					backgroundColor: 'white',
					boxShadow: `0 0 0 2px ${theme.teal['300']} inset`,
				},
				'&$error': {
					boxShadow: `0 0 0 2px ${theme.red['500']} inset`,
				},
			},
			input: {
				height: 26,
				padding: '5px 10px',
			},
			inputMultiline: {
				padding: '10px',
			},
			multiline: {
				padding: 0,
			},
		},
		MuiInputAdornment: {
			root: {
				color: theme.blueGrey['500'],
				'& p': {
					color: theme.blueGrey['500'],
				},
			},
			positionStart: {
				marginLeft: 10,
				marginRight: null,
			},
			positionEnd: {
				marginLeft: null,
				marginRight: 10,
			},
		},
		MuiSelect: {
			select: {
				paddingTop: 11,
				paddingBottom: 10,
				'&:focus': {
					backgroundColor: null,
				},
				'&$disabled': {
					color: `rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.42)`,
				},
			},
			icon: {
				color: theme.blueGrey['300'],
				fontSize: 16,
				flexShrink: 0,
				right: '10px',
				top: 'calc(50% - 8px)',
				userSelect: 'none',
				pointerEvents: 'none',
			},
		},
		MuiAutocomplete: {
			input: {
				'$inputRoot[class*="MuiInput-root"] &': {
					padding: '5px 10px',
				},
				'$inputRoot[class*="MuiInput-root"] &:first-child': {
					padding: '5px 10px',
				},
			},
			endAdornment: {
				top: 0,
				padding: '0 10px',
			},
			clearIndicator: {
				color: theme.blueGrey['300'],
				fontSize: 16,
				marginRight: 5,
				padding: 10,
				'&:hover': {
					backgroundColor: 'transparent',
					color: theme.blueGrey['600'],
				},
			},
			clearIndicatorDirty: {
				visibility: 'visible',
			},
			popupIndicator: {
				color: theme.blueGrey['300'],
				fontSize: 16,
				marginRight: 0,
				padding: 0,
				userSelect: 'none',
				pointerEvents: 'none',
			},
		},
		MuiSlider: {
			root: {
				height: 6,
				padding: '13px 0 7px',
				transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				'&$disabled': {
					color: theme.blueGrey['100'],
				},
			},
			rail: {
				borderRadius: 3,
				height: 6,
			},
			track: {
				borderRadius: 3,
				height: 6,
			},
			mark: {
				display: 'none',
			},
			markLabel: {
				color: theme.blueGrey['400'],
				fontSize: 13,
				fontWeight: 500,
				lineHeight: 1.3,
				'&$disabled': {
					color: theme.blueGrey['400'],
				},
			},
			markLabelActive: {
				color: null,
			},
			valueLabel: {
				left: null,
				top: -20,
				'& > span': {
					borderRadius: '8px',
					height: 'auto',
					padding: '4px 8px',
					transform: 'none',
					width: 'auto',
				},
				'& > span > span': {
					transform: 'none',
				},
			},
			thumb: {
				boxShadow: [
					`0 2px 1px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.2)`,
					`0 1px 1px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.14)`,
					`0 1px 3px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.12)`,
				].join(),
				height: 16,
				marginLeft: -8,
				width: 16,
				'&.Mui-focusVisible, &:hover, &$active': {
					boxShadow: [
						`0 2px 1px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.2)`,
						`0 1px 1px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.14)`,
						`0 1px 3px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.12)`,
					].join(),
				},
				'&$disabled': {
					height: null,
					marginTop: null,
					marginLeft: null,
					width: null,
				},
			},
			thumbColorPrimary: {
				boxShadow: [
					`0 2px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.25)`,
					`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
					`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
				].join(),
				'&.Mui-focusVisible, &:hover, &$active': {
					boxShadow: [
						`0 2px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.25)`,
						`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
						`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
					].join(),
				},
				'&$disabled': {
					boxShadow: [
						`0 2px 1px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.2)`,
						`0 1px 1px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.14)`,
						`0 1px 3px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.12)`,
					].join(),
				},
			},
		},
		MuiSwitch: {
			switchBase: {
				color: theme.brightness['1'],
				height: 'initial',
				width: 'initial',
				'&:hover': {
					backgroundColor: 'transparent !important',
					color: theme.brightness['1'],
				},
			},
			track: {
				backgroundColor: theme.blueGrey['500'],
				opacity: 0.26,
			},
			thumb: {
				boxShadow: [
					`0 2px 1px -1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.2)`,
					`0 1px 1px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.14)`,
					`0 1px 3px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['600'])}, 0.12)`,
				].join(),
			},
			colorPrimary: {
				'&$checked:not($disabled) $thumb': {
					boxShadow: [
						`0 2px 5px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.25)`,
						`0 2px 2px 0 rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.14)`,
						`0 3px 1px -2px rgba(${ColorConvert.hex.rgb(theme.teal['600'])}, 0.12)`,
					].join(),
				},
				'&$disabled': {
					color: theme.blueGrey['100'],
					'& + $track': {
						backgroundColor: theme.blueGrey['500'],
					},
				},
			},
		},
		MuiRadio: {
			root: {
				color: theme.blueGrey['300'],
				padding: 10,
				'& svg': {
					height: 20,
					width: '20px !important',
				},
				'&:hover': {
					backgroundColor: 'transparent !important',
					color: theme.blueGrey['300'],
				},
			},
			colorPrimary: {
				'&$disabled': {
					color: theme.blueGrey['100'],
				},
			},
		},
		MuiCheckbox: {
			root: {
				alignSelf: 'flex-start',
				color: theme.blueGrey['200'],
				fontSize: 20,
				height: 'inherit',
				width: 'inherit',
				'&:hover': {
					color: theme.blueGrey['200'],
				},
			},
			colorPrimary: {
				'&$disabled': {
					color: theme.blueGrey['100'],
				},
				'&:hover': {
					backgroundColor: 'transparent',
				},
				'&$checked': {
					'&:hover': {
						backgroundColor: 'transparent',
					},
				},
			},
		},
		MuiBackdrop: {
			root: {
				backgroundColor: `rgba(${ColorConvert.hex.rgb(theme.slateGrey['5'])}, 0.6)`,
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
				[`.stickyTitle &, .stickyActions &`]: {
					overflowY: 'initial',
				},
			},
			paperScrollPaper: {
				maxHeight: 'calc(100% - 40px)',
			},
		},
		MuiDialogTitle: {
			root: {
				padding: '16px 20px',
			},
		},
		MuiDialogContent: {
			root: {
				padding: '20px',
				'&:first-child': {
					paddingTop: null,
				},
			},
			dividers: {
				padding: null,
				borderBottom: `1px solid ${theme.brightness['5']}`,
				borderTop: `1px solid ${theme.brightness['5']}`,
			},
		},
		MuiDialogContentText: {
			root: {
				color: theme.blueGrey['500'],
			},
		},
		MuiDialogActions: {
			root: {
				padding: '10px 20px',
				'.MuiDialogContent-root > &': {
					padding: '20px 0 0',
				},
			},
			spacing: {
				'& > :not(:first-child)': {
					marginLeft: 15,
				},
			},
		},
		MuiTableCell: {
			head: {
				borderBottomColor: theme.brightness['4'],
				color: theme.blueGrey['300'],
				fontSize: 14,
				fontWeight: 600,
				lineHeight: 1.3,
				paddingTop: 18,
				paddingBottom: 18,
			},
			body: {
				color: theme.blueGrey['700'],
				borderBottomColor: theme.brightness['4'],
			},
			stickyHeader: {
				backgroundColor: 'white',
			},
		},
		MuiTabs: {
			root: {
				minHeight: 44,
			},
			indicator: {
				backgroundColor: theme.teal['300'],
				borderRadius: '4px 4px 0px 0',
				height: 3,
			},
		},
		MuiTab: {
			root: {
				fontSize: 14,
				fontWeight: 600,
				minHeight: 44,
				margin: '0 15px',
				padding: '6px 0',
				textTransform: 'initial',
				'@media (min-width: 600px)': {
					fontSize: 14,
					minWidth: 'auto',
				},
				'&:first-child': {
					marginLeft: 0,
				},
				'&:last-child': {
					marginRight: 0,
				},
			},
			textColorInherit: {
				color: theme.blueGrey['500'],
				opacity: null,
				'&$selected': {
					color: theme.teal['300'],
					opacity: null,
				},
			},
		},
		MuiSnackbarContent: {
			root: {
				backgroundColor: 'white',
				color: theme.blueGrey['700'],
				fontSize: 14,
				padding: '10px 20px',
			},
			action: {
				alignSelf: 'flex-start',
				marginRight: -10,
				marginTop: 6,
				'& .close': {
					padding: 4,
				},
			},
		},
	},
	palette: {
		primary: {
			main: theme.teal['300'],
			light: theme.teal['200'],
			dark: theme.teal['400'],
			contrastText: '#ffffff',
		},
		divider: theme.brightness['5'],
	},
	props: {
		MuiInputLabel: {
			disableAnimation: true,
			shrink: true,
			component: 'div',
		},
		MuiInput: {
			autoComplete: 'off',
		},
		MuiInputBase: {
			autoComplete: 'off',
		},
		MuiSelect: {
			IconComponent: props => <FontAwesomeIcon {...props} icon={['far', 'angle-down']} />,
			MenuProps: {
				elevation: 3,
				transitionDuration: 150,
				TransitionComponent: Fade,
			},
			displayEmpty: true,
		},
		MuiAutocomplete: {
			PaperComponent: props => <Paper {...props} elevation={3} />,
			closeIcon: <FontAwesomeIcon icon={['fal', 'times']} />,
			popupIcon: <FontAwesomeIcon icon={['far', 'angle-down']} />,
			loadingText: 'Загрузка...',
			noOptionsText: 'Нет результатов для выбора',
			clearText: '',
		},
		MuiCheckbox: {
			color: 'primary',
			icon: <FontAwesomeIcon icon={['far', 'square']} />,
			checkedIcon: <FontAwesomeIcon icon={['fas', 'check-square']} />,
		},
		MuiButtonBase: {
			disableRipple: true,
		},
		MuiButtonGroup: {
			disableRipple: true,
		},
		MuiToggleButton: {
			disableRipple: true,
		},
		MuiTooltip: {
			enterDelay: 50,
			leaveDelay: 100,
			TransitionComponent: Fade,
			TransitionProps: {
				timeout: 150,
			},
			arrow: true,
		},
	},
	shadows: [
		'none',
		`0px 1px 1px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 1px 3px 0px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 2px 2px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 1px 5px 0px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 3px 4px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 1px 8px 0px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 4px 5px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 1px 10px 0px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 5px 8px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 1px 14px 0px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 6px 10px 0px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 1px 18px 0px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 7px 10px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 2px 16px 1px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 8px 10px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 3px 14px 2px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 9px 12px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 3px 16px 2px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 10px 14px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 4px 18px 3px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 11px 15px 1px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 4px 20px 3px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 12px 17px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 5px 22px 4px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 13px 19px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 5px 24px 4px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 14px 21px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 5px 26px 4px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 15px 22px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 6px 28px 5px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 16px 24px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 6px 30px 5px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 17px 26px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 6px 32px 5px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 18px 28px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 7px 34px 6px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 19px 29px 2px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 7px 36px 6px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 20px 31px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 8px 38px 7px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 21px 33px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 8px 40px 7px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 22px 35px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 8px 42px 7px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 23px 36px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 9px 44px 8px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
		`0px 24px 38px 3px rgba(${ColorConvert.hex.rgb(theme.blueGrey['500'])}, 0.14), 0px 9px 46px 8px rgba(${ColorConvert.hex.rgb(
			theme.blueGrey['500']
		)}, 0.12)`,
	],
	typography: {
		useNextVariants: true,
		fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica, Segoe, sans-serif',
		fontSize: 14,
		h1: {
			color: theme.blueGrey['700'],
			fontSize: 92,
		},
		h2: {
			color: theme.blueGrey['700'],
			fontSize: 56,
		},
		h3: {
			color: theme.blueGrey['700'],
			fontSize: 44,
		},
		h4: {
			color: theme.blueGrey['700'],
			fontSize: 30,
		},
		h5: {
			color: theme.blueGrey['700'],
			fontSize: 20,
			fontWeight: 500,
		},
		h6: {
			color: theme.blueGrey['600'],
			fontSize: 16,
			fontWeight: 600,
		},
		subtitle1: {
			color: theme.blueGrey['700'],
			fontSize: 14,
		},
		subtitle2: {
			color: theme.blueGrey['700'],
			fontSize: 13,
		},
		body1: {
			color: theme.blueGrey['600'],
			fontSize: 14,
			lineHeight: 1.3,
		},
		body2: {
			color: theme.blueGrey['600'],
			fontSize: 13,
			lineHeight: 1.3,
		},
		caption: {
			color: theme.blueGrey['300'],
			fontSize: 14,
			lineHeight: 1.3,
		},
	},
	shape: {
		borderRadius: 8,
	},
});
