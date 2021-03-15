import React, { useState, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import MuiFormHelperText from '@material-ui/core/FormHelperText';

import { declensionNumber } from 'src/helpers/utils';

import { scrollToDialogElement } from '../helpers/utils';
import ReceiptSellingPrice from '../components/Receipts/ReceiptSellingPrice';
import MessageWithIcon from '../components/MessageWithIcon';

const styles = () => ({
	container: {
		paddingBottom: 40,
	},
	title: {
		marginBottom: 20,
	},
});

const FormHelperText = withStyles({
	root: {
		fontSize: 14,
		lineHeight: 1.4,
		marginLeft: 0,
		marginTop: 0,
	},
})(MuiFormHelperText);

function PriceFormation({ classes, dialogRef, formikProps, formikProps: { values, getFieldMeta } }) {
	const [sellingReceiptsCount, setSellingReceiptsCount] = useState(0);
	const getFieldReceipts = getFieldMeta('receipts');
	const receiptsPriceSavedError =
		getFieldReceipts.error && getFieldReceipts.error.some(receipt => typeof receipt.visibleFormationPriceFields === 'string');

	useEffect(() => {
		setSellingReceiptsCount(values.receipts.reduce((sum, receipt) => sum + (!receipt.position.isFree ? 1 : 0), 0));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.receipts.length]);

	useEffect(() => {
		if (receiptsPriceSavedError) scrollToDialogElement(dialogRef, 'sentinel-topStepper', 'start');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [receiptsPriceSavedError]);

	return (
		<DialogContent className={classes.container} style={{ overflow: 'initial' }}>
			<Typography className={classes.title} variant="h5" align="center">
				Формирование цены продажи
			</Typography>

			<MessageWithIcon
				message={
					<>
						Для {declensionNumber(sellingReceiptsCount, ['позиции', 'позиций', 'позиций'], true)} рассчитана цена продажи.
						<br />
						При необходимости измените её вручную.
						{receiptsPriceSavedError ? (
							<>
								<br />
								<FormHelperText component="span" error>
									Сохраните цену продажи у позиций.
								</FormHelperText>
							</>
						) : null}
					</>
				}
			/>

			{values.receipts.length ? (
				<div>
					{values.receipts.map((receipt, index) => (
						<ReceiptSellingPrice key={receipt.id} index={index} receipt={receipt} formikProps={formikProps} />
					))}
				</div>
			) : null}
		</DialogContent>
	);
}

export default withStyles(styles)(PriceFormation);
