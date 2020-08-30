import React from 'react';
import { Field } from 'formik';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import { formError, formErrorHelperText } from 'src/helpers/utils';

import PositionNameInList from 'src/components/PositionNameInList';
import NumberFormat from 'src/components/NumberFormat';

import styles from './index.module.css';

const ReceiptTempPosition = props => {
	const {
		setPositionIndexInProcurement,
		onOpenDialogByName,
		index,
		receiptTempPosition,
		arrayHelpers: { remove },
		formikProps: { errors, isSubmitting, touched },
	} = props;

	const isNmpNmp = receiptTempPosition.position.unitReceipt === 'nmp' && receiptTempPosition.position.unitRelease === 'nmp';

	const onOpenDialogPositionCreateReplacement = () => {
		const { createdAt, isArchived, archivedAfterEnded, deliveryIsExpected, hasReceipts, ...remainingProps } = receiptTempPosition.position;

		const positionReplacement = {
			...remainingProps,
			childPosition: receiptTempPosition.position,
		};

		setPositionIndexInProcurement(index);
		onOpenDialogByName('dialogPositionCreateReplacement', 'positionReplacement', positionReplacement);
	};

	const onOpenDialogPositionEditReplacement = () => {
		setPositionIndexInProcurement(index);
		onOpenDialogByName('dialogPositionEditReplacement', 'positionReplacement', receiptTempPosition.position);
	};

	return (
		<Grid className={styles.positionItem} wrap="nowrap" alignItems="baseline" container>
			<Grid className={styles.positionNumber} item>
				{index + 1}
			</Grid>
			<Grid className={styles.positionContent} direction="column" container>
				<Grid alignItems="center" style={{ marginBottom: 15 }} container>
					<Grid className={styles.positionSelected} zeroMinWidth item>
						<PositionNameInList
							name={receiptTempPosition.position.name}
							characteristics={receiptTempPosition.position.characteristics}
							size="md"
							positionReplaced={receiptTempPosition.position.childPosition}
							minHeight={false}
						/>
					</Grid>
					<Grid className={styles.actionButtons} item>
						{!receiptTempPosition.position.childPosition ? (
							<Tooltip title="Создать позицию на замену" placement="top">
								<IconButton className={styles.actionButton} onClick={onOpenDialogPositionCreateReplacement} tabIndex={-1}>
									<FontAwesomeIcon icon={['far-c', 'position-replacement']} />
								</IconButton>
							</Tooltip>
						) : null}
						{receiptTempPosition.position.notCreated ? (
							<Tooltip title="Редактировать" placement="top">
								<IconButton className={styles.actionButton} onClick={onOpenDialogPositionEditReplacement} tabIndex={-1}>
									<FontAwesomeIcon icon={['far', 'pen']} />
								</IconButton>
							</Tooltip>
						) : null}
						<Tooltip title="Удалить из заказа" placement="top">
							<IconButton
								className={ClassNames({
									[styles.actionButton]: true,
									destructiveAction: true,
								})}
								onClick={() => remove(index)}
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
							name={`receiptsTempPositions.${index}.quantity`}
							label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
							placeholder="0"
							error={formError(touched, errors, `receiptsTempPositions.${index}.quantity`)}
							helperText={formErrorHelperText(touched, errors, `receiptsTempPositions.${index}.quantity`, null)}
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

export default ReceiptTempPosition;
