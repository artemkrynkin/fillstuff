import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { createShop } from 'src/actions/shops';

import FormShopCreateEdit from './FormShopCreateEdit';
import shopSchema from './shopSchema';

class DialogShopList extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
	};

	onSubmit = async (values, actions) => {
		const { onCloseDialog, onCallback } = this.props;
		const newShop = shopSchema.cast(values);

		this.props.createShop({ shop: newShop }).then(response => {
			if (onCallback !== undefined) onCallback(response);

			actions.setSubmitting(false);

			if (response.status === 'success') onCloseDialog();

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

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		if (onExitedDialog) onExitedDialog();
	};

	render() {
		const { type, dialogOpen, onCloseDialog, selectedShop } = this.props;

		if (type === 'edit' && !selectedShop) return null;

		let initialValues = {
			name: '',
			link: '',
		};

		if (selectedShop) initialValues = { ...initialValues, ...selectedShop };

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog}>
				<DialogTitle onClose={onCloseDialog} theme="white">
					{type === 'create' ? 'Создание магазина' : 'Редактирование магазина'}
				</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={shopSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => <FormShopCreateEdit onCloseDialog={onCloseDialog} type={type} formikProps={props} />}
				</Formik>
			</Dialog>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createShop: shop => dispatch(createShop({ data: shop })),
	};
};

export default connect(null, mapDispatchToProps)(DialogShopList);
