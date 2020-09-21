import React from 'react';
import { Field } from 'formik';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import { formError, formErrorHelperText } from 'src/helpers/utils';

import PositionSummary from 'src/components/PositionSummary';
import NumberFormat from 'src/components/NumberFormat';

import styles from './index.module.css';

const OrderedReceiptPosition = props => {
	const {
		setPositionIndexInProcurement,
		onOpenDialogByName,
		index,
		orderedReceiptPosition: { position },
		arrayHelpers: { remove },
		formikProps: { errors, isSubmitting, touched },
	} = props;

	const isNmpNmp = position.unitReceipt === 'nmp' && position.unitRelease === 'nmp';

	const onOpenDialogPositionCreateReplacement = () => {
		const { name, qrcodeId, printDestination, positionGroup, unitReceipt, unitRelease, minimumBalance, isFree, characteristics } = position;

		const positionReplacement = {
			name,
			qrcodeId,
			printDestination,
			positionGroup,
			unitReceipt,
			unitRelease,
			minimumBalance,
			isFree,
			characteristics,
			childPosition: position._id,
		};

		setPositionIndexInProcurement(index);
		onOpenDialogByName('dialogPositionCreateReplacement', 'positionReplacement', positionReplacement);
	};

	return (
		<Grid className={styles.positionItem} wrap="nowrap" alignItems="baseline" container>
			<Grid className={styles.positionNumber} item>
				{index + 1}
			</Grid>
			<Grid className={styles.positionContent} direction="column" container>
				<Grid className={styles.positionContentHeader} alignItems="center" container>
					<Grid className={styles.positionSelected} zeroMinWidth item>
						<PositionSummary
							name={position.name}
							characteristics={position.characteristics}
							size="md"
							childPosition={position.childPosition}
							minHeight={false}
						/>
					</Grid>
					<Grid className={styles.actionButtons} item>
						{!position.childPosition && !position.parentPosition ? (
							<Tooltip title="Создать позицию на замену" placement="top">
								<IconButton
									className={styles.actionButton}
									onClick={onOpenDialogPositionCreateReplacement}
									disabled={isSubmitting}
									tabIndex={-1}
								>
									<FontAwesomeIcon icon={['far-c', 'position-replacement']} />
								</IconButton>
							</Tooltip>
						) : null}
						<Tooltip title="Удалить из заказа" placement="top">
							<IconButton
								className={ClassNames(styles.actionButton, 'destructiveAction')}
								onClick={() => remove(index)}
								disabled={isSubmitting}
								tabIndex={-1}
							>
								<FontAwesomeIcon icon={['far', 'trash']} />
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
				<Grid alignItems="flex-start" spacing={2} container>
					<Grid xs={3} item>
						<Field
							name={`orderedReceiptsPositions.${index}.quantity`}
							label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
							placeholder="0"
							error={formError(touched, errors, `orderedReceiptsPositions.${index}.quantity`)}
							helperText={formErrorHelperText(touched, errors, `orderedReceiptsPositions.${index}.quantity`, null)}
							as={TextField}
							InputProps={{
								inputComponent: NumberFormat,
								inputProps: {
									allowNegative: false,
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
};

export default OrderedReceiptPosition;
