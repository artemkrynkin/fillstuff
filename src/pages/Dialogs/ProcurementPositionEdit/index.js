import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { sleep } from 'shared/utils';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import PositionForm from './PositionForm';
import positionSchema from './positionSchema';

class DialogProcurementPositionEdit extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		onCallback: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	onSubmit = async (values, actions) => {
		const { onCloseDialog, onCallback } = this.props;
		const position = positionSchema(true).cast(values);

		await sleep(500);

		actions.setSubmitting(false);

		if (onCallback) onCallback(position);

		onCloseDialog();
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		if (onExitedDialog) onExitedDialog();
	};

	render() {
		const { dialogOpen, onCloseDialog, selectedPosition } = this.props;

		if (!selectedPosition) return null;

		let initialValues = {
			name: '',
			characteristics: [],
		};

		if (selectedPosition) initialValues = { ...initialValues, ...selectedPosition };

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="lg" scroll="body">
				<DialogTitle onClose={onCloseDialog} theme="noTheme">
					Изменение характеристик
				</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={positionSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={this.onSubmit}
				>
					{formikProps => <PositionForm onCloseDialog={onCloseDialog} formikProps={formikProps} />}
				</Formik>
			</Dialog>
		);
	}
}

export default DialogProcurementPositionEdit;
