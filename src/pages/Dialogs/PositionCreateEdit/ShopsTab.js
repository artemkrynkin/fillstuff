import React, { Fragment, useState } from 'react';
import { FieldArray, Formik } from 'formik';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ShopAddingForm from './ShopAddingForm';
import ShopsList from './ShopsList';
import shopSchema from './shopSchema';

import styles from './index.module.css';

const ShopsTab = props => {
	const {
		type,
		formikProps: { values },
	} = props;
	const [visibleShopAddingForm, setVisibleShopAddingForm] = useState(false);

	const onToggleVisibleShopAddingForm = value => setVisibleShopAddingForm(value);

	const initialValues = {
		shop: undefined,
		link: '',
		comment: '',
	};

	const onSubmit = (values, actions, arrayHelpers) => {
		arrayHelpers.push(values);

		onToggleVisibleShopAddingForm(false);
	};

	return (
		<DialogContent dividers={true}>
			<div className={styles.minHeightContent}>
				<FieldArray name="shops" validateOnChange={false}>
					{arrayHelpers => (
						<Fragment>
							{visibleShopAddingForm ? (
								<Formik
									initialValues={initialValues}
									validationSchema={shopSchema}
									validateOnBlur={false}
									validateOnChange={false}
									onSubmit={(values, actions) => onSubmit(values, actions, arrayHelpers)}
								>
									{formikProps => (
										<ShopAddingForm
											type={type}
											formikPropsPosition={props.formikProps}
											onToggleVisibleShopAddingForm={onToggleVisibleShopAddingForm}
											formikProps={formikProps}
										/>
									)}
								</Formik>
							) : (
								<Fragment>
									{!values.shops.length ? (
										<Grid direction="column" alignItems="center" container>
											<Typography className={styles.emptyText} variant="caption">
												Ещё не добавлено ни одного магазина.
											</Typography>
											<Button onClick={() => onToggleVisibleShopAddingForm(true)} variant="outlined" color="primary" size="small">
												Добавить магазин
											</Button>
										</Grid>
									) : (
										<Button onClick={() => onToggleVisibleShopAddingForm(true)} variant="outlined" color="primary" size="small">
											Добавить магазин
										</Button>
									)}
								</Fragment>
							)}
							{values.shops.length ? <ShopsList formikProps={props.formikProps} arrayHelpers={arrayHelpers} /> : null}
						</Fragment>
					)}
				</FieldArray>
			</div>
		</DialogContent>
	);
};

export default ShopsTab;
