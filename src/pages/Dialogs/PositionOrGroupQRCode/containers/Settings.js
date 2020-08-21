import React, { memo, useMemo } from 'react';
import { Field } from 'formik';
import ClassNames from 'classnames';

import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import NumberFormat from 'src/components/NumberFormat';
import CheckboxIcon from 'src/components/CheckboxIcon';

import renderOptions, {
	stickerWidthMax,
	stickerWidthOptimal,
	titleSizeMax,
	titleSizeOptimal,
	renderOptionsTranslate,
} from '../helpers/renderOptions';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './Settings.module.css';

import { ReactComponent as EachUnitIcon } from 'public/img/other/each_unit.svg';
import { ReactComponent as StorageIcon } from 'public/img/other/storage.svg';

const printDestinationContainer = ClassNames({
	[styles.printDestinationContainer]: true,
	[stylesGlobal.formLabelControl]: true,
});

const Settings = props => {
	const {
		type,
		formikProps: { errors, touched, isSubmitting, setFieldValue, values },
	} = props;

	const titleSizeMaxMemoized = useMemo(() => titleSizeMax(values.stickerSize), [values.stickerSize]);

	const changeDestination = destination => {
		if (destination !== values.printDestination) {
			if (destination === 'eachUnit') setFieldValue('stickerOrientation', 'portrait');

			setFieldValue('printDestination', destination);
		}
	};

	const onChangeSlider = (fieldName, value) => {
		if (value !== values[fieldName]) {
			if (fieldName === 'stickerSize') {
				setFieldValue('stickerWidth', stickerWidthOptimal(stickerWidthMax(value)));
				setFieldValue('titleSize', titleSizeOptimal(titleSizeMax(value)));
			}

			setFieldValue(fieldName, value);
		}
	};

	const onChangeRadio = event => {
		if (event.target.value !== values[event.target.name]) {
			setFieldValue(event.target.name, event.target.value);
		}
	};

	return (
		<Grid className={styles.container} xs={4} item>
			<Grid className={styles.containerInner} wrap="nowrap" direction="column" container>
				<div className={styles.formFields}>
					{type === 'position' ? (
						<Grid className={printDestinationContainer} justify="space-around" container>
							{renderOptions.printDestination.map(destination => (
								<CheckboxIcon
									key={destination}
									onClick={() => changeDestination(destination)}
									icon={destination === 'storage' ? <StorageIcon /> : <EachUnitIcon />}
									label={renderOptionsTranslate.printDestination[destination]}
									checked={values.printDestination === destination}
									disabled={isSubmitting}
								/>
							))}
						</Grid>
					) : null}

					<Collapse className={styles.collapse} in={values.printDestination === 'eachUnit'} timeout={350}>
						<Grid className={stylesGlobal.formLabelControl}>
							<Field
								name="quantity"
								label="Количество в PDF"
								error={Boolean(touched.quantity && errors.quantity)}
								helperText={(touched.quantity && errors.quantity) || ''}
								as={TextField}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
										isAllowed: values => {
											const { formattedValue, floatValue } = values;
											return formattedValue === '' || floatValue <= 9999;
										},
									},
								}}
								fullWidth
							/>
						</Grid>
					</Collapse>

					<Collapse className={styles.collapse} in={values.printDestination === 'storage'} timeout={350}>
						<Grid className={stylesGlobal.formLabelControl} style={{ marginBottom: 12 }}>
							<FormLabel>Раскладка</FormLabel>
							<FormControl component="fieldset" fullWidth>
								<RadioGroup name="stickerOrientation" onChange={onChangeRadio} value={values.stickerOrientation} row>
									{renderOptions.stickerOrientation.map((orientation, index) => {
										if (orientation === 'landscape') {
											return (
												<Tooltip key={index} title="На данный момент альбомная раскладка доступна в бета-версии" placement="top">
													<FormControlLabel
														key={index}
														value={orientation}
														control={<Radio color="primary" />}
														label={renderOptionsTranslate.stickerOrientation[orientation]}
														labelPlacement="end"
														disabled={isSubmitting}
														// disabled={isSubmitting || orientation === 'landscape'}
													/>
												</Tooltip>
											);
										} else {
											return (
												<FormControlLabel
													key={index}
													value={orientation}
													control={<Radio color="primary" />}
													label={renderOptionsTranslate.stickerOrientation[orientation]}
													labelPlacement="end"
													disabled={isSubmitting || orientation === 'landscape'}
												/>
											);
										}
									})}
								</RadioGroup>
							</FormControl>
						</Grid>
					</Collapse>

					<Grid className={stylesGlobal.formLabelControl}>
						<FormLabel>{values.stickerOrientation === 'portrait' ? 'Ширина стикера' : 'Высота стикера'}</FormLabel>
						<FormControl fullWidth>
							<Slider
								value={values.stickerSize}
								onChange={(event, value) => onChangeSlider('stickerSize', value)}
								step={1}
								min={renderOptions.stickerSize[0]}
								max={renderOptions.stickerSize[renderOptions.stickerSize.length - 1]}
								valueLabelDisplay="auto"
								disabled={isSubmitting}
							/>
							<Grid justify="space-between" container>
								<FormLabel>{renderOptions.stickerSize[0]} см</FormLabel>
								<FormLabel>{renderOptions.stickerSize[renderOptions.stickerSize.length - 1]} см</FormLabel>
							</Grid>
						</FormControl>
					</Grid>

					<Collapse className={styles.collapse} in={values.stickerOrientation === 'landscape'} timeout={350}>
						<Grid className={stylesGlobal.formLabelControl}>
							<InputLabel>Ширина стикера</InputLabel>
							<FormControl fullWidth>
								<Slider
									value={values.stickerWidth}
									onChange={(event, value) => onChangeSlider('stickerWidth', value)}
									step={1}
									min={renderOptions.stickerWidth[0]}
									max={renderOptions.stickerWidth[renderOptions.stickerWidth.length - 1]}
									valueLabelDisplay="auto"
									disabled={isSubmitting}
								/>
								<Grid justify="space-between" container>
									<FormLabel>{renderOptions.stickerWidth[0]} см</FormLabel>
									<FormLabel>{renderOptions.stickerWidth[renderOptions.stickerWidth.length - 1]} см</FormLabel>
								</Grid>
							</FormControl>
						</Grid>
					</Collapse>

					<Collapse className={styles.collapse} in={values.printDestination === 'storage'} timeout={350}>
						<Grid className={stylesGlobal.formLabelControl}>
							<InputLabel>Размер заголовка</InputLabel>
							<FormControl fullWidth>
								<Slider
									value={values.titleSize}
									onChange={(event, value) => onChangeSlider('titleSize', value)}
									step={1}
									min={renderOptions.titleSize[0]}
									max={titleSizeMaxMemoized}
									valueLabelDisplay="auto"
									disabled={isSubmitting || (values.stickerOrientation === 'portrait' && values.stickerSize < 4)}
								/>
								<Grid justify="space-between" container>
									<FormLabel>{renderOptions.titleSize[0]} pt</FormLabel>
									<FormLabel>{titleSizeMaxMemoized} pt</FormLabel>
								</Grid>
							</FormControl>
						</Grid>
					</Collapse>

					<Grid>
						<FormLabel>Цвет стикера</FormLabel>
						<FormControl component="fieldset" fullWidth>
							<RadioGroup name="stickerColor" onChange={onChangeRadio} value={values.stickerColor} row>
								{renderOptions.stickerColor.map((type, index) => (
									<FormControlLabel
										key={index}
										value={type}
										control={<Radio color="primary" />}
										label={renderOptionsTranslate.stickerColor[type]}
										labelPlacement="end"
										disabled={isSubmitting}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>
				</div>

				<DialogActions className={styles.action}>
					<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large" fullWidth>
						{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
						<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
							Печать
						</span>
					</Button>
				</DialogActions>
			</Grid>
		</Grid>
	);
};

export default memo(Settings);
