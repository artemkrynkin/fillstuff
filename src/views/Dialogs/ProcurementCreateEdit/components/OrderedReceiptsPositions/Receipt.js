import React from 'react';
import ClassNames from 'classnames';
import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import colorTheme from 'shared/colorTheme';

import PositionSummary from 'src/components/PositionSummary';
import NumberFormat from 'src/components/NumberFormat';

import { helperText } from '../../helpers/utils';

const styles = {
	receiptItem: {
		'&:not(:last-child)': {
			marginBottom: 20,
		},
	},
	receiptNumber: {
		color: colorTheme.blueGrey['300'],
		fontSize: 14,
		fontWeight: 600,
		padding: '5px 0',
		width: 35,
	},
	receiptContent: {
		borderBottom: `1px solid ${colorTheme.brightness['5']}`,
		flex: '1 1',
		paddingBottom: 20,
		minWidth: 0,
		'$receiptItem:last-child &': {
			borderBottom: 'none',
			paddingBottom: 0,
		},
	},
	receiptContentHeader: {
		marginBottom: 15,
	},
	positionSelected: {
		flex: '1 1',
	},
	actionButtons: {
		marginLeft: 'auto',
		paddingLeft: 20,
	},
	actionButton: {
		padding: 0,
		'& svg': {
			fontSize: 16,
		},
	},
};

function Receipt({
	classes,
	index,
	receipt,
	position = receipt.position,
	formikProps: { isSubmitting, values, getFieldMeta },
	arrayHelpers: { remove },
}) {
	const fieldsMeta = {
		quantity: getFieldMeta(`orderedReceiptsPositions.${index}.quantity`),
	};
	const isNmpNmp = position.unitReceipt === 'nmp' && position.unitRelease === 'nmp';

	const onRemoveReceipt = () => remove(index);

	return (
		<Grid className={classes.receiptItem} wrap="nowrap" alignItems="flex-start" container>
			<Grid className={classes.receiptNumber} item>
				{index + 1}
			</Grid>
			<Grid className={classes.receiptContent} direction="column" container>
				<Grid className={classes.receiptContentHeader} alignItems="center" container>
					<Grid className={classes.positionSelected} zeroMinWidth item>
						<PositionSummary name={position.name} characteristics={position.characteristics} size="md" avatar />
					</Grid>
					<Grid className={classes.actionButtons} item>
						<Tooltip title="Удалить из списка" placement="top">
							<div>
								<IconButton
									className={ClassNames(classes.actionButton, 'destructiveAction')}
									onClick={onRemoveReceipt}
									disabled={isSubmitting}
									tabIndex={-1}
								>
									<FontAwesomeIcon icon={['far', 'trash']} />
								</IconButton>
							</div>
						</Tooltip>
					</Grid>
				</Grid>
				<Grid alignItems="flex-start" spacing={2} container>
					<Grid xs={3} item>
						<Field
							name={`orderedReceiptsPositions.${index}.quantity`}
							label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
							placeholder="0"
							as={TextField}
							error={fieldsMeta.quantity.touched && Boolean(fieldsMeta.quantity.error)}
							helperText={helperText(fieldsMeta.quantity.touched, fieldsMeta.quantity.error)}
							InputProps={{
								inputComponent: NumberFormat,
								inputProps: {
									allowNegative: false,
									maxLength: 7,
								},
							}}
							disabled={isSubmitting}
							fullWidth
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default withStyles(styles)(Receipt);
