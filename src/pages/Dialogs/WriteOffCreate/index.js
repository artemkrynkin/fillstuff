import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import NumberFormat from 'src/components/NumberFormat';

import { getStudioStore } from 'src/actions/studio';
import { createWriteOff } from 'src/actions/writeOffs';
import { enqueueSnackbar } from 'src/actions/snackbars';

import stylesGlobal from 'src/styles/globals.module.css';

const writeOffSchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1)
		.required(),
});

class DialogWriteOffCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, selectedPosition } = this.props;

		this.props.createWriteOff(selectedPosition._id, values).then(response => {
			actions.setSubmitting(false);

			if (response.status === 'success') {
				this.props.getStudioStore();
				onCloseDialog();
			}

			if (response.status === 'error') {
				this.props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedPosition } = this.props;

		if (!selectedPosition) return null;

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body">
				<DialogTitle onClose={onCloseDialog} theme="noTheme">
					Списание количества
				</DialogTitle>
				<Formik
					initialValues={{ quantity: '', purchaseExpenseStudio: true }}
					validationSchema={writeOffSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<DialogContent>
								<Grid className={stylesGlobal.formLabelControl}>
									<TextField
										label="Наименование"
										InputProps={{
											value: selectedPosition.name,
											readOnly: true,
										}}
										fullWidth
										readOnly
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
												Списать
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

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		createWriteOff: (positionId, data) => dispatch(createWriteOff({ params: { positionId }, data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogWriteOffCreate);
