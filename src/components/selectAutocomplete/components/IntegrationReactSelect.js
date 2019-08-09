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
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import colorPalette from 'shared/colorPalette';

const useStyles = makeStyles(theme => ({
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
		margin: theme.spacing(0.5, 0.25),
	},
	chipFocused: {
		backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
	},
	noOptionsMessage: {
		padding: theme.spacing(1, 2),
	},
	singleValue: {
		color: colorPalette.blueGrey.cBg700,
		fontSize: 13,
	},
	singleValueDisabled: {
		color: colorPalette.blueGrey.cBg400,
		fontSize: 13,
	},
	placeholder: {
		color: `rgba(${ColorConvert.hex.rgb(colorPalette.blueGrey.cBg700)}, 0.42)`,
		fontSize: 13,
		position: 'absolute',
	},
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	divider: {
		height: theme.spacing(2),
	},
}));

const selectStyles = {
	clearIndicator: base => ({
		...base,
		color: colorPalette.blueGrey.cBg300,
		cursor: 'pointer',
		fontSize: 16,
		'&:hover': {
			color: colorPalette.teal.cT300,
		},
	}),
	dropdownIndicator: base => ({
		...base,
		color: colorPalette.blueGrey.cBg300,
		cursor: 'pointer',
		fontSize: 16,
		'&:hover': {
			color: colorPalette.blueGrey.cBg300,
		},
	}),
	indicatorSeparator: base => ({
		...base,
		backgroundColor: colorPalette.blueGrey.cBg100,
		marginBottom: 4,
		marginTop: 4,
	}),
	input: base => ({
		...base,
		margin: 0,
		color: colorPalette.blueGrey.cBg700,
		'& input': {
			font: 'inherit',
		},
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
		<MenuItem
			ref={props.innerRef}
			selected={props.isFocused}
			component="div"
			style={{
				fontWeight: props.isSelected ? 500 : 400,
			}}
			{...props.innerProps}
		>
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

// const Menu = props => {
// 	return (
// 		<Paper className={props.selectProps.classes.paper} {...props.innerProps}>
// 			{props.children}
// 		</Paper>
// 	);
// };
//
// Menu.propTypes = {
// 	children: PropTypes.node,
// 	innerProps: PropTypes.object,
// 	selectProps: PropTypes.object,
// };

const components = {
	ClearIndicator,
	Control,
	DropdownIndicator,
	// Menu,
	LoadingIndicator,
	MultiValue,
	NoOptionsMessage,
	Option,
	Placeholder,
	SingleValue,
	ValueContainer,
};

const IntegrationReactSelect = props => {
	const classes = useStyles();

	return (
		<CreatableSelect
			classes={classes}
			styles={selectStyles}
			components={components}
			onChange={option => (option !== null ? props.form.setFieldValue(props.field.name, option.value) : null)}
			onBlur={props.field.onBlur}
			{...props}
		/>
	);
};

export default IntegrationReactSelect;
