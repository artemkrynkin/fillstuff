import React from 'react';
import PropTypes from 'prop-types';

import ClassNames from 'classnames';
import ColorConvert from 'color-convert';
import { components as reactSelectComponents } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emphasize, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import theme from 'shared/theme';

import styles from './IntegrationReactSelect.module.css';

const useStyles = makeStyles(DefaultTheme => ({
	root: {
		flexGrow: 1,
		height: 250,
	},
	input: {
		display: 'flex',
		padding: '5px 2px 5px 10px',
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden',
	},
	chip: {
		margin: DefaultTheme.spacing(0.5, 0.25),
	},
	chipFocused: {
		backgroundColor: emphasize(
			DefaultTheme.palette.type === 'light' ? DefaultTheme.palette.grey[300] : DefaultTheme.palette.grey[700],
			0.08
		),
	},
	noOptionsMessage: {
		padding: DefaultTheme.spacing(1, 2),
	},
	singleValue: {
		color: theme.blueGrey.cBg700,
		fontSize: 13,
	},
	singleValueDisabled: {
		color: theme.blueGrey.cBg400,
		fontSize: 13,
	},
	placeholder: {
		color: `rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg700)}, 0.42)`,
		fontSize: 13,
		position: 'absolute',
	},
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: DefaultTheme.spacing(1),
		left: 0,
		right: 0,
	},
	divider: {
		height: DefaultTheme.spacing(2),
	},
}));

const selectStyles = {
	clearIndicator: base => ({
		...base,
		color: theme.blueGrey.cBg300,
		cursor: 'pointer',
		fontSize: 16,
		'&:hover': {
			color: theme.teal.cT300,
		},
	}),
	dropdownIndicator: base => ({
		...base,
		color: theme.blueGrey.cBg300,
		cursor: 'pointer',
		fontSize: 16,
		'&:hover': {
			color: theme.blueGrey.cBg300,
		},
	}),
	indicatorSeparator: base => ({
		...base,
		backgroundColor: theme.blueGrey.cBg100,
		marginBottom: 4,
		marginTop: 4,
	}),
	input: base => ({
		...base,
		margin: 0,
		color: theme.blueGrey.cBg700,
		'& input': {
			font: 'inherit',
		},
	}),
	menu: base => ({
		...base,
		boxShadow: [
			`0 1px 8px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.2)`,
			`0 3px 4px 0 rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.14)`,
			`0 3px 3px -2px rgba(${ColorConvert.hex.rgb(theme.blueGrey.cBg600)}, 0.12)`,
		].join(),
		borderRadius: 8,
	}),
	menuList: base => ({
		...base,
		paddingBottom: 6,
		paddingTop: 6,
	}),
};

const NoOptionsMessage = props => {
	return (
		<Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
			{props.children}
		</Typography>
	);
};

NoOptionsMessage.propTypes = {
	children: PropTypes.node,
	innerProps: PropTypes.object,
	selectProps: PropTypes.object.isRequired,
};

const inputComponent = ({ inputRef, ...props }) => {
	return <div ref={inputRef} {...props} />;
};

inputComponent.propTypes = {
	inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const Control = props => {
	const {
		children,
		innerProps,
		innerRef,
		selectProps: { classes, TextFieldProps },
	} = props;

	return (
		<TextField
			fullWidth
			InputProps={{
				inputComponent,
				inputProps: {
					className: classes.input,
					ref: innerRef,
					children,
					...innerProps,
				},
			}}
			{...TextFieldProps}
		/>
	);
};

Control.propTypes = {
	children: PropTypes.node,
	innerProps: PropTypes.object,
	innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	selectProps: PropTypes.object.isRequired,
};

const Option = props => {
	return (
		<MenuItem ref={props.innerRef} selected={props.isSelected} component="div" {...props.innerProps}>
			{props.children}
		</MenuItem>
	);
};

Option.propTypes = {
	children: PropTypes.node,
	innerProps: PropTypes.object,
	innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	isFocused: PropTypes.bool,
	isSelected: PropTypes.bool,
};

const Placeholder = props => {
	return (
		<Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
			{props.children}
		</Typography>
	);
};

Placeholder.propTypes = {
	children: PropTypes.node,
	innerProps: PropTypes.object,
	selectProps: PropTypes.object.isRequired,
};

const SingleValue = props => {
	return (
		<Typography
			className={!props.isDisabled ? props.selectProps.classes.singleValue : props.selectProps.classes.singleValueDisabled}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
};

SingleValue.propTypes = {
	children: PropTypes.node,
	innerProps: PropTypes.object,
	selectProps: PropTypes.object.isRequired,
};

const ValueContainer = props => {
	return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
};

ValueContainer.propTypes = {
	children: PropTypes.node,
	selectProps: PropTypes.object.isRequired,
};

const MultiValue = props => {
	return (
		<Chip
			tabIndex={-1}
			label={props.children}
			className={ClassNames(props.selectProps.classes.chip, {
				[props.selectProps.classes.chipFocused]: props.isFocused,
			})}
			onDelete={props.removeProps.onClick}
			// deleteIcon={}
		/>
	);
};

MultiValue.propTypes = {
	children: PropTypes.node,
	isFocused: PropTypes.bool,
	removeProps: PropTypes.object.isRequired,
	selectProps: PropTypes.object.isRequired,
};

const ClearIndicator = props => {
	return (
		<reactSelectComponents.ClearIndicator {...props}>
			<FontAwesomeIcon icon={['fal', 'times']} />
		</reactSelectComponents.ClearIndicator>
	);
};

const DropdownIndicator = props => {
	return (
		<reactSelectComponents.DropdownIndicator {...props}>
			<FontAwesomeIcon icon={['far', 'angle-down']} />
		</reactSelectComponents.DropdownIndicator>
	);
};

const LoadingIndicator = props => {
	return <div style={{ marginRight: 8 }} children={<CircularProgress size={16} />} />;
};

const components = {
	ClearIndicator,
	Control,
	DropdownIndicator,
	LoadingIndicator,
	MultiValue,
	NoOptionsMessage,
	Option,
	Placeholder,
	SingleValue,
	ValueContainer,
};

const IntegrationReactSelect = props => {
	const { formatCreateLabel, ...remainingProps } = props;
	const classes = useStyles();

	return (
		<CreatableSelect
			classes={classes}
			styles={selectStyles}
			components={components}
			onChange={option => (option !== null ? props.form.setFieldValue(props.field.name, option.value) : null)}
			onBlur={props.field.onBlur}
			formatCreateLabel={value => (
				<div className={styles.optionSelected}>
					{formatCreateLabel || `Создать`} «{value}»
				</div>
			)}
			{...remainingProps}
		/>
	);
};

export default IntegrationReactSelect;
