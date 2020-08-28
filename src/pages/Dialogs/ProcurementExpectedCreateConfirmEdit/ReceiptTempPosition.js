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
		onOpenDialogByName,
		index,
		receiptTempPosition,
		arrayHelpers: { remove },
		formikProps: { errors, isSubmitting, touched },
	} = props;

	const isNmpNmp = receiptTempPosition.position.unitReceipt === 'nmp' && receiptTempPosition.position.unitRelease === 'nmp';

	return (
		<Grid className={styles.positionItem} wrap="nowrap" alignItems="baseline" container>
			<Grid className={styles.positionItemNumber} item>
				{index + 1}
			</Grid>
			<Grid className={styles.positionItemContent} direction="column" container>
				<Grid wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 15 }} container>
					<Grid style={{ flex: '1 1' }} zeroMinWidth item>
						<PositionNameInList
							name={receiptTempPosition.position.name}
							characteristics={receiptTempPosition.position.characteristics}
							size="md"
						/>
					</Grid>
					<Grid className={styles.actionButtons} item>
						<Tooltip title="Создать позицию на замену" placement="top">
							<IconButton
								className={styles.editActionButton}
								onClick={() => {
									const positionReplacement = {
										...receiptTempPosition.position,
										childPosition: receiptTempPosition.position,
										positionIndexInProcurement: index,
									};

									delete positionReplacement._id;

									onOpenDialogByName('dialogPositionCreateReplacement', 'positionReplacement', positionReplacement);
								}}
								tabIndex={-1}
							>
								<FontAwesomeIcon icon={['far-c', 'position-replacement']} style={{ fontSize: 18 }} />
							</IconButton>
						</Tooltip>
						<Tooltip title="Редактировать" placement="top">
							<IconButton className={styles.editActionButton} tabIndex={-1}>
								<FontAwesomeIcon icon={['far', 'pen']} />
							</IconButton>
						</Tooltip>
						<Tooltip title="Удалить из заказа" placement="top">
							<IconButton
								className={ClassNames({
									[styles.deleteActionButton]: true,
									destructiveAction: true,
								})}
								onClick={() => remove(index)}
								tabIndex={-1}
							>
								<FontAwesomeIcon icon={['fal', 'times']} />
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
