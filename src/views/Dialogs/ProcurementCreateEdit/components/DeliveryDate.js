import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Field, ErrorMessage } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import { LocalizationProvider, StaticDatePicker } from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';

import { timesInterval15Minutes } from 'shared/utils';

import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';
import CheckboxWithLabel from 'src/components/CheckboxWithLabel';

const styles = theme => ({
	deliveryDateFieldGrid: {
		width: 130,
	},
	deliveryTimeFromFieldGrid: {
		width: 103,
	},
	deliveryTimeToFieldGrid: {
		width: 113,
	},
	deliveryTimeLabel: {
		marginLeft: -8,
	},
	deliveryTimeField: {
		flex: '1 1',
	},
	isUnknownDeliveryDateGrid: {
		marginBottom: -10,
	},
});

function DeliveryDate({ classes, formikProps: { isSubmitting, values, touched, errors, setFieldValue } }) {
	const refDropdownDeliveryDate = useRef(null);
	const [dropdownDeliveryDate, setDropdownDeliveryDate] = useState(false);

	const onHandleDropdownDeliveryDate = value =>
		setDropdownDeliveryDate(!value === null || value === undefined ? !dropdownDeliveryDate : value);

	const onChangeDeliveryDate = date => {
		setFieldValue('isConfirmed', true);
		setFieldValue('deliveryDate', date);
		onHandleDropdownDeliveryDate(false);
	};

	const onChangeDeliveryTimeFrom = ({ target: { value } }) => {
		setFieldValue('deliveryTimeFrom', value);

		const timeFromParse = value.split(':');
		const timeToParse = values.deliveryTimeTo ? values.deliveryTimeTo.split(':') : [0, 0];
		const deliveryTimeFromMoment = moment().set({ hour: timeFromParse[0], minute: timeFromParse[1], second: 0 });
		const deliveryTimeToMoment = moment().set({ hour: timeToParse[0], minute: timeToParse[1], second: 0 });

		if (deliveryTimeFromMoment.isSameOrAfter(deliveryTimeToMoment)) {
			setFieldValue('deliveryTimeTo', value);
		}
	};

	const onChangeIsUnknownDeliveryDate = ({ target: { checked } }) => {
		setFieldValue('isUnknownDeliveryDate', checked);
		setFieldValue('isConfirmed', checked);

		if (checked) {
			setFieldValue('deliveryDate', undefined);
			setFieldValue('deliveryTimeFrom', '');
			setFieldValue('deliveryTimeTo', '');
		}
	};

	return (
		<>
			<Grid direction="column" container>
				<Collapse in={!values.isUnknownDeliveryDate} timeout="auto">
					<Grid wrap="nowrap" alignItems="flex-start" spacing={2} container>
						<Grid className={classes.deliveryDateFieldGrid} item>
							<TextField
								innerRef={refDropdownDeliveryDate}
								name="deliveryDate"
								placeholder="Дата"
								error={touched.deliveryDate && Boolean(errors.deliveryDate)}
								disabled={isSubmitting}
								value={values.deliveryDate ? moment(values.deliveryDate).format('DD.MM.YYYY') : ''}
								onFocus={() => setTimeout(() => onHandleDropdownDeliveryDate(true), 100)}
								fullWidth
							/>
						</Grid>

						<Grid className={classes.deliveryTimeFromFieldGrid} item>
							<Grid alignItems="baseline" container>
								<InputLabel className={classes.deliveryTimeLabel} data-inline>
									c
								</InputLabel>
								<Grid className={classes.deliveryTimeField} item>
									<Field
										name="deliveryTimeFrom"
										as={Select}
										error={touched.deliveryTimeFrom && Boolean(errors.deliveryTimeFrom)}
										onChange={onChangeDeliveryTimeFrom}
										renderValue={value => value || '-'}
										disabled={isSubmitting}
										fullWidth
									>
										<MenuItem value="">Без времени</MenuItem>
										{timesInterval15Minutes.map((time, index) => (
											<MenuItem key={index} value={time}>
												{time}
											</MenuItem>
										))}
									</Field>
								</Grid>
							</Grid>
						</Grid>

						<Grid className={classes.deliveryTimeToFieldGrid} item>
							<Grid alignItems="baseline" container>
								<InputLabel className={classes.deliveryTimeLabel} data-inline>
									до
								</InputLabel>
								<Grid className={classes.deliveryTimeField} item>
									<Field
										name="deliveryTimeTo"
										as={Select}
										error={touched.deliveryTimeTo && Boolean(errors.deliveryTimeTo)}
										renderValue={value => value || '-'}
										disabled={isSubmitting}
										fullWidth
									>
										<MenuItem value="">Без времени</MenuItem>
										{timesInterval15Minutes.map((time, index) => {
											const timeFromIndex = timesInterval15Minutes.findIndex(timeInterval => timeInterval === values.deliveryTimeFrom);

											return (
												<MenuItem key={index} value={time} hidden={index < timeFromIndex}>
													{time}
												</MenuItem>
											);
										})}
									</Field>
								</Grid>
							</Grid>
						</Grid>
					</Grid>

					<ErrorMessage name="deliveryDate">{message => <FormHelperText error>{message}</FormHelperText>}</ErrorMessage>
				</Collapse>

				<Grid className={classes.isUnknownDeliveryDateGrid} item>
					<Field
						type="checkbox"
						name="isUnknownDeliveryDate"
						Label={{ label: 'Дата доставки не известна' }}
						as={CheckboxWithLabel}
						onChange={onChangeIsUnknownDeliveryDate}
						disabled={isSubmitting}
					/>
				</Grid>
			</Grid>

			<Dropdown
				anchor={refDropdownDeliveryDate}
				open={dropdownDeliveryDate}
				onClose={() => onHandleDropdownDeliveryDate(false)}
				placement="bottom"
				disablePortal={false}
			>
				<LocalizationProvider dateAdapter={MomentUtils}>
					<StaticDatePicker
						views={['date']}
						displayStaticWrapperAs="desktop"
						reduceAnimations
						value={values.deliveryDate}
						onChange={onChangeDeliveryDate}
						leftArrowButtonProps={{
							size: 'small',
						}}
						leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
						rightArrowButtonProps={{
							size: 'small',
						}}
						rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
						disablePast
						allowKeyboardControl={false}
					/>
				</LocalizationProvider>
			</Dropdown>
		</>
	);
}

export default withStyles(styles)(DeliveryDate);
