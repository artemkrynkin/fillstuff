import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import Chips from 'src/components/Chips';

import positionGroupSchema from './positionGroupSchema';
import { SearchTextField } from './styles';

import { createPositionGroup, editPositionGroup, addPositionsInPositionGroup } from 'src/actions/positionGroups';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const selectPositionsClasses = (selectedPositions, positionId) => {
	return ClassNames({
		[styles.selectPosition]: true,
		[styles.selectPositionSelected]: selectedPositions.some(selectedPosition => selectedPosition._id === positionId),
	});
};

const findOnlyPositionByName = (position, string) => {
	if (position.positions) return false;

	const searchString = String(string).toLowerCase();
	const characteristics = position.characteristics.reduce(
		(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
		''
	);
	const positionName = String(position.name + ' ' + characteristics).toLowerCase();

	return positionName.indexOf(searchString) !== -1;
};

class DialogPositionGroupCreateEditAdd extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit', 'add']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
		selectedPositionGroup: PropTypes.object,
	};

	initialState = {
		searchString: '',
	};

	state = this.initialState;

	searchInputRef = React.createRef();

	onTypeSearch = ({ target: { value } }) => this.setState({ searchString: value });

	onClearSearch = () => {
		this.setState({ searchString: '' });

		this.searchInputRef.current.focus();
	};

	onPositionGroupSubmit = (values, actions) => {
		const { type, onCloseDialog, positionGroup = positionGroupSchema(type, true).cast(values) } = this.props;

		switch (type) {
			case 'add':
				return this.props.addPositionsInPositionGroup(positionGroup._id, positionGroup).then(response => {
					if (response.status === 'success') onCloseDialog();
					else actions.setSubmitting(false);
				});
			case 'edit':
				return this.props.editPositionGroup(positionGroup._id, positionGroup).then(response => {
					if (response.status === 'success') onCloseDialog();
					else actions.setSubmitting(false);
				});
			case 'create':
			default:
				return this.props.createPositionGroup(positionGroup).then(response => {
					if (response.status === 'success') onCloseDialog();
					else actions.setSubmitting(false);
				});
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const {
			type,
			dialogOpen,
			onCloseDialog,
			positionsInGroups: {
				data: positionsInGroups,
				isFetching: isLoadingPositionsInGroups,
				// error: errorPositions
			},
			selectedPositionGroup,
		} = this.props;
		const { searchString } = this.state;

		if ((type === 'edit' || type === 'add') && !selectedPositionGroup) return null;

		const positions = positionsInGroups ? positionsInGroups.filter(position => findOnlyPositionByName(position, searchString)) : [];

		let initialValues =
			type === 'create'
				? {
						name: '',
						dividedPositions: true,
						minimumBalance: '',
						positions: [],
				  }
				: type === 'edit'
				? {
						minimumBalance: '',
						...selectedPositionGroup,
				  }
				: {
						minimumBalance: '',
						...selectedPositionGroup,
						positions: [],
				  };

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="md" scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{type === 'create' ? 'Создание новой группы' : type === 'edit' ? 'Редактирование группы' : 'Добавление позиций в группу'}
				</PDDialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={() => positionGroupSchema(type)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onPositionGroupSubmit(values, actions)}
					render={({ errors, isSubmitting, values }) => (
						<Form>
							<DialogContent style={{ overflow: 'initial' }}>
								{type === 'create' || type === 'edit' ? (
									<div>
										<Grid
											className={stylesGlobal.formLabelControl}
											style={{ marginBottom: 12 }}
											wrap="nowrap"
											alignItems="flex-start"
											container
										>
											<InputLabel error={Boolean(errors.name)} style={{ minWidth: 100 }}>
												Наименование:
											</InputLabel>
											<Field
												name="name"
												component={TextField}
												InputLabelProps={{
													shrink: true,
												}}
												autoComplete="off"
												autoFocus
												fullWidth
											/>
										</Grid>

										<Grid className={stylesGlobal.formLabelControl} style={{ marginBottom: 12, paddingLeft: 110 }}>
											<Grid>
												<Field
													name="dividedPositions"
													Label={{ label: 'Считать позиции раздельно' }}
													component={CheckboxWithLabel}
													color="primary"
													icon={<FontAwesomeIcon icon={['far', 'square']} />}
													checkedIcon={<FontAwesomeIcon icon={['fas', 'check-square']} />}
												/>
											</Grid>
										</Grid>

										{!values.dividedPositions ? (
											<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
												<InputLabel error={Boolean(errors.minimumBalance)} style={{ minWidth: 100 }}>
													Мин. остаток:
												</InputLabel>
												<FormControl fullWidth>
													<Field
														name="minimumBalance"
														type="number"
														placeholder="0"
														component={TextField}
														InputLabelProps={{
															shrink: true,
														}}
														autoComplete="off"
														fullWidth
													/>
												</FormControl>
											</Grid>
										) : null}
									</div>
								) : null}

								{type === 'create' || type === 'add' ? (
									<Grid className={styles.selectPositions} direction="column" wrap="nowrap" container>
										<InputLabel error={typeof errors.positions === 'string'} style={{ minWidth: 151 }}>
											Выберите позиции: {typeof errors.positions === 'string' ? errors.positions : null}
										</InputLabel>
										<div className={styles.textFieldSearchContainer}>
											<SearchTextField
												inputRef={this.searchInputRef}
												placeholder="Поиск позиций"
												InputProps={{
													value: searchString,
													onChange: this.onTypeSearch,
												}}
												fullWidth
											/>
											{searchString ? (
												<ButtonBase onClick={this.onClearSearch} className={styles.textFieldSearchClear}>
													<FontAwesomeIcon icon={['fal', 'times']} />
												</ButtonBase>
											) : null}
										</div>
										<FieldArray
											name="positions"
											validateOnChange={false}
											render={arrayHelpers => (
												<div className={styles.selectPositionsWrap}>
													{values.positions.length ? (
														<Chips
															className={styles.selectedPositions}
															chips={values.positions}
															onRenderChipLabel={position => (
																<span>
																	{position.name}{' '}
																	{position.characteristics.reduce(
																		(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
																		''
																	)}
																</span>
															)}
															onRemoveChip={(chips, index) => arrayHelpers.remove(index)}
														/>
													) : null}
													{!isLoadingPositionsInGroups ? (
														positions.length ? (
															positions.map((position, index) => (
																<div
																	key={index}
																	className={selectPositionsClasses(values.positions, position._id)}
																	onClick={() => {
																		const selectedPositionIndex = values.positions.findIndex(
																			selectedPosition => selectedPosition._id === position._id
																		);

																		this.searchInputRef.current.focus();

																		if (!!~selectedPositionIndex) return arrayHelpers.remove(selectedPositionIndex);
																		else return arrayHelpers.push(position);
																	}}
																>
																	<div className={styles.selectPositionCheckbox}>
																		<FontAwesomeIcon icon={['far', 'check']} />
																	</div>
																	<div>
																		{position.name}{' '}
																		{position.characteristics.reduce(
																			(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
																			''
																		)}
																	</div>
																</div>
															))
														) : !positions.length && searchString ? (
															<Typography variant="caption" align="center" display="block" style={{ marginTop: 20 }}>
																Среди позиций совпадений не найдено.
															</Typography>
														) : (
															<Typography variant="caption" align="center" display="block" style={{ marginTop: 20 }}>
																Нет позиций для группировки.
															</Typography>
														)
													) : (
														<div children={<CircularProgress size={20} />} style={{ marginTop: 20, textAlign: 'center' }} />
													)}
												</div>
											)}
										/>
									</Grid>
								) : null}
							</DialogContent>
							<PDDialogActions
								leftHandleProps={{
									handleProps: {
										onClick: onCloseDialog,
									},
									text: 'Отмена',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? (
										<CircularProgress size={20} />
									) : type === 'create' ? (
										'Создать'
									) : type === 'edit' ? (
										'Сохранить'
									) : (
										'Добавить'
									),
								}}
							/>
						</Form>
					)}
				/>
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		positionsInGroups: state.positions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		createPositionGroup: positionGroup => dispatch(createPositionGroup(currentStockId, positionGroup)),
		editPositionGroup: (positionGroupId, newValues) => dispatch(editPositionGroup(positionGroupId, newValues)),
		addPositionsInPositionGroup: (positionGroupId, newValues) => dispatch(addPositionsInPositionGroup(positionGroupId, newValues)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogPositionGroupCreateEditAdd);
