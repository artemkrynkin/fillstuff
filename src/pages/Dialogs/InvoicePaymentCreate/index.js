import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';
import NumberFormat, { currencyFormatInputProps, currencyFormatProps } from 'src/components/NumberFormat';

import { createInvoicePayment } from 'src/actions/invoices';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const invoicePaymentSchema = Yup.object().shape({
	amount: Yup.number()
		.min(0)
		.required(),
});

class DialogInvoicePaymentCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedInvoice: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, selectedInvoice } = this.props;
		const newValues = invoicePaymentSchema.cast(values);

		this.props.createInvoicePayment(selectedInvoice._id, newValues).then(response => {
			actions.setSubmitting(false);
			onCloseDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedInvoice } = this.props;

		if (!selectedInvoice) return null;

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body">
				<DialogTitle onClose={onCloseDialog}>
					Счет за {moment(selectedInvoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(selectedInvoice.toDate).format('DD.MM.YYYY')} от{' '}
					{moment(selectedInvoice.createdAt).format('DD.MM.YYYY')}
				</DialogTitle>
				<Formik
					initialValues={{ amount: '' }}
					validationSchema={invoicePaymentSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<DialogContent>
								<Grid className={styles.header} alignItems="center" container>
									<Grid xs={6} item>
										<div className={styles.user}>
											<Avatar
												className={styles.userPhoto}
												src={selectedInvoice.member.user.avatar}
												alt={selectedInvoice.member.user.name}
												children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
											/>
											<Grid alignItems="flex-end" container>
												<div className={styles.userName}>{selectedInvoice.member.user.name}</div>
											</Grid>
										</div>
									</Grid>
									<Grid xs={6} item>
										<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
											<NumberFormat
												value={selectedInvoice.amount}
												renderText={value => (
													<div className={styles.totalPrice}>
														Сумма по счету: <span>{value}</span>
													</div>
												)}
												displayType="text"
												onValueChange={() => {}}
												{...currencyFormatProps}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="amount"
										label="Сумма к оплате"
										error={Boolean(touched.amount && errors.amount)}
										helperText={(touched.amount && errors.amount) || ''}
										as={TextField}
										InputProps={{
											inputComponent: NumberFormat,
											inputProps: {
												...currencyFormatInputProps,
											},
										}}
										fullWidth
										autoFocus
									/>
								</Grid>
							</DialogContent>
							<DialogActions
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
									text: 'Принять оплату',
									isLoading: isSubmitting,
								}}
							/>
						</Form>
					)}
				</Formik>
			</Dialog>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		createInvoicePayment: (invoiceId, data) => dispatch(createInvoicePayment({ params: { invoiceId }, data })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogInvoicePaymentCreate);
