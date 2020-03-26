import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import NumberFormat from 'src/components/NumberFormat';

import { getStudioStock } from 'src/actions/studio';
import { activeReceiptAddQuantity } from 'src/actions/receipts';

import stylesGlobal from 'src/styles/globals.module.css';

const addQuantitySchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1)
		.required(),
	comment: Yup.string().required(),
});

class DialogReceiptActiveAddQuantity extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, selectedPosition } = this.props;

		this.props.activeReceiptAddQuantity(selectedPosition._id, values).then(response => {
			if (response.status === 'success') {
				this.props.getStudioStock();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = this.props;

		if (!selectedPosition) return null;

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body">
				<DialogTitle onClose={onCloseDialog}>Добавление количества</DialogTitle>
				<Formik
					initialValues={{ quantity: '', comment: '' }}
					validationSchema={addQuantitySchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<DialogContent>
								<Grid className={stylesGlobal.formLabelControl}>
									<TextField
										className="none-padding"
										label="Наименование"
										InputProps={{
											value: selectedPosition.name,
											readOnly: true,
										}}
										fullWidth
									/>
								</Grid>
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="quantity"
										label="Количество"
										error={Boolean(touched.quantity && errors.quantity)}
										helperText={(touched.quantity && errors.quantity) || ''}
										as={TextField}
										InputProps={{
											inputComponent: NumberFormat,
											inputProps: {
												allowNegative: false,
											},
										}}
										fullWidth
										autoFocus
									/>
								</Grid>
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="comment"
										label="Комментарий"
										error={Boolean(touched.comment && errors.comment)}
										helperText={(touched.comment && errors.comment) || ''}
										as={TextField}
										rows={2}
										rowsMax={4}
										multiline
										fullWidth
									/>
								</Grid>
							</DialogContent>
							<DialogActions>
								<Grid spacing={2} container>
									<Grid xs={4} item>
										<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
											Отмена
										</Button>
									</Grid>
									<Grid xs={8} item>
										<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large" fullWidth>
											{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
											<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
												Добавить
											</span>
										</Button>
									</Grid>
								</Grid>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		activeReceiptAddQuantity: (positionId, data) => dispatch(activeReceiptAddQuantity({ params: { positionId }, data })),
	};
};

export default connect(null, mapDispatchToProps)(DialogReceiptActiveAddQuantity);
