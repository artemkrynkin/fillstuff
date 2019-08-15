import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MuiTextField from '@material-ui/core/TextField/TextField';

import { unitTypeTransform } from 'shared/checkProductAndMarkers';

import { PDDialog, PDDialogTitle, PDDialogActions } from 'src/components/Dialog';

import { productSchema } from 'src/containers/Dialogs/ProductAndMarkersCreate/components/FormScheme';

import { getStockStatus } from 'src/actions/stocks';
import { editProduct } from 'src/actions/products';

class DialogProductEdit extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
		selectedProduct: PropTypes.object,
	};

	onProductEdit = (values, actions) => {
		const { onCloseDialog, product = productSchema.cast(values) } = this.props;

		this.props.editProduct(product._id, product).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedProduct } = this.props;

		if (!selectedProduct) return null;

		let initialValues = {
			minimumBalance: '',
			...selectedProduct,
		};

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="lg" scroll="body">
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Редактирование позиции
				</PDDialogTitle>
				{selectedProduct ? (
					<Formik
						initialValues={initialValues}
						validationSchema={productSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => this.onProductEdit(values, actions)}
						render={({ errors, isSubmitting, values }) => (
							<Form>
								<DialogContent>
									<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} wrap="nowrap" alignItems="flex-start" container>
										<InputLabel error={Boolean(errors.name)} style={{ minWidth: 146 }}>
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

									<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12, paddingLeft: 156 }}>
										<Grid>
											<Field
												name="dividedMarkers"
												Label={{ label: 'Считать маркеры раздельно' }}
												component={CheckboxWithLabel}
												color="primary"
												icon={<FontAwesomeIcon icon={['far', 'square']} />}
												checkedIcon={<FontAwesomeIcon icon={['fas', 'check-square']} />}
											/>
										</Grid>
									</Grid>

									<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
										<InputLabel error={Boolean(errors.receiptUnits)} style={{ minWidth: 146 }}>
											Единица поступления:
										</InputLabel>
										<FormControl fullWidth>
											<MuiTextField
												className="none-padding"
												name="receiptUnits"
												InputProps={{
													readOnly: true,
													value: unitTypeTransform(values.receiptUnits),
												}}
												fullWidth
											/>
										</FormControl>
									</Grid>

									{values.receiptUnits === 'nmp' ? (
										<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
											<InputLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
												Единица отпуска:
											</InputLabel>
											<FormControl fullWidth>
												<MuiTextField
													className="none-padding"
													name="unitIssue"
													InputProps={{
														readOnly: true,
														value: unitTypeTransform(values.unitIssue),
													}}
													fullWidth
												/>
											</FormControl>
										</Grid>
									) : null}

									{!values.dividedMarkers ? (
										<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
											<InputLabel error={Boolean(errors.minimumBalance)} style={{ minWidth: 146 }}>
												Мин. остаток в {values.receiptUnits === 'nmp' && values.unitIssue !== 'pce' ? 'упаковках' : 'штуках'}:
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
										text: isSubmitting ? <CircularProgress size={20} /> : 'Сохранить позицию',
									}}
								/>
							</Form>
						)}
					/>
				) : null}
			</PDDialog>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		editProduct: (productId, newValues) => dispatch(editProduct(productId, newValues)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(DialogProductEdit);
