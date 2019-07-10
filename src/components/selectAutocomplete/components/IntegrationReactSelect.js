import React from 'react';
import PropTypes from 'prop-types';

import ClassNames from 'classnames';
import { components as reactSelectComponents } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		height: 250,
	},
	input: {
		display: 'flex',
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
		fontSize: 13,
	},
	placeholder: {
		fontSize: 13,
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
		<Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
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

const ClearIndicator = props => {
	return (
		<reactSelectComponents.ClearIndicator {...props}>
			<FontAwesomeIcon icon={['fal', 'times']} className="pd-selectIcon" style={{ position: 'static' }} />
		</reactSelectComponents.ClearIndicator>
	);
};

const DropdownIndicator = props => {
	return (
		<reactSelectComponents.DropdownIndicator {...props}>
			<FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" style={{ position: 'static' }} />
		</reactSelectComponents.DropdownIndicator>
	);
};

const components = {
	ClearIndicator,
	Control,
	DropdownIndicator,
	// Menu,
	MultiValue,
	NoOptionsMessage,
	Option,
	Placeholder,
	SingleValue,
	ValueContainer,
};

const IntegrationReactSelect = props => {
	const classes = useStyles();
	const theme = useTheme();

	const selectStyles = {
		input: base => ({
			...base,
			color: theme.palette.text.primary,
			'& input': {
				font: 'inherit',
			},
		}),
	};

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
