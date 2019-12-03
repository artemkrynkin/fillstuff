import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import { TableCell } from './styles';

import styles from './WriteOffs.module.css';

class WriteOff extends Component {
	render() {
		const { writeOff, onOpenDialogWriteOff } = this.props;

		return (
			<TableRow className={styles.writeOff}>
				<TableCell>
					{writeOff.position.name}{' '}
					{writeOff.position.characteristics.reduce(
						(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
						''
					)}
				</TableCell>
				<TableCell width={150}>{writeOff.user.name}</TableCell>
				<TableCell align="right" width={80}>
					{writeOff.quantity}
				</TableCell>
				<TableCell align="right" width={80}>
					{!writeOff.position.isFree ? `${writeOff.cost || writeOff.receipt.unitSellingPrice} ₽` : '-'}
				</TableCell>
				{/* показывать год, только если списание не за текущий год */}
				<TableCell align="right" width={140}>
					{moment(writeOff.createdAt).format('DD MMM в HH:mm')}
				</TableCell>
				<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
					<div>
						<IconButton
							className={styles.writeOffActionsButton}
							onClick={() => onOpenDialogWriteOff('dialogWriteOffDelete', writeOff)}
							size="small"
						>
							<FontAwesomeIcon icon={['fal', 'times']} />
						</IconButton>
					</div>
				</TableCell>
			</TableRow>
		);
	}
}

WriteOff.propTypes = {
	currentStockId: PropTypes.string.isRequired,
	writeOff: PropTypes.object.isRequired,
};

export default WriteOff;
