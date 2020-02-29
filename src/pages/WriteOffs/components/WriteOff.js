import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import AvatarTitle from 'src/components/AvatarTitle';

import styles from './WriteOff.module.css';

import { TableCell } from './styles';

const WriteOff = props => {
	const { writeOff, isCurrentDay, onOpenDialogWriteOffCancel } = props;

	const createdAtMoment = moment(writeOff.createdAt);
	const isCurrentDayWriteOff = moment()
		.subtract({ day: 1 })
		.isBefore(writeOff.createdAt);
	const isCurrentHour = moment()
		.subtract({ hour: 1 })
		.isBefore(writeOff.createdAt);
	const isNow = moment()
		.subtract({ minute: 1 })
		.isBefore(writeOff.createdAt);

	return (
		<TableRow className={styles.writeOff}>
			<TableCell width={100}>
				<AvatarTitle imageSrc={writeOff.member.user.avatar} title={writeOff.member.user.name} />
			</TableCell>
			<TableCell>
				<PositionNameInList
					name={writeOff.position.name}
					characteristics={writeOff.position.characteristics}
					canceled={writeOff.canceled}
				/>
			</TableCell>
			<TableCell align="right" width={115}>
				{writeOff.quantity} {writeOff.position.unitIssue === 'pce' ? 'шт.' : 'уп.'}
			</TableCell>
			<TableCell align="right">
				<div className={styles.moneyContainer}>
					<NumberFormat
						value={formatNumber(writeOff.purchasePrice, { toString: true })}
						renderText={value => <span className={styles.moneyLarge}>{value}</span>}
						displayType="text"
						{...currencyMoneyFormatProps}
					/>
					<NumberFormat
						value={formatNumber(writeOff.unitPurchasePrice, { toString: true })}
						renderText={value => <span className={styles.moneySmall}>{value}</span>}
						displayType="text"
						{...currencyMoneyFormatProps}
					/>
				</div>
			</TableCell>
			<TableCell align="right">
				{!writeOff.isFree ? (
					<div className={styles.moneyContainer}>
						<NumberFormat
							value={formatNumber(writeOff.sellingPrice, { toString: true })}
							renderText={value => <span className={styles.moneyLarge}>{value}</span>}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
						<NumberFormat
							value={formatNumber(writeOff.unitSellingPrice, { toString: true })}
							renderText={value => <span className={styles.moneySmall}>{value}</span>}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
					</div>
				) : (
					<span className={styles.caption}>Бесплатно</span>
				)}
			</TableCell>
			<TableCell align="right" width={140}>
				{!isCurrentHour ? createdAtMoment.format('HH:mm') : !isNow ? createdAtMoment.fromNow() : 'только что'}
			</TableCell>
			{isCurrentDay ? (
				<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
					{isCurrentDayWriteOff && !writeOff.canceled ? (
						<Tooltip title="Отменить списание" placement="top">
							<IconButton className={styles.cancelWriteOffButton} onClick={onOpenDialogWriteOffCancel} size="small">
								<FontAwesomeIcon icon={['far', 'undo']} />
							</IconButton>
						</Tooltip>
					) : null}
				</TableCell>
			) : null}
		</TableRow>
	);
};

export default WriteOff;
