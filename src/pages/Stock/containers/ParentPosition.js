import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import QuantityIndicator from 'src/components/QuantityIndicator';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

import { archivePositionAfterEnded } from 'src/actions/positions';

import SellingPriceDisplay from '../components/SellingPriceDisplay';

import { TableCell } from './styles';
import stylesPositions from './Positions.module.css';
import styles from './Position.module.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Position from './Position';

const ParentPosition = props => {
	const { position, childPosition, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const onArchivedAfterEnded = () => {
		props.archivePositionAfterEnded(position._id, { archivedAfterEnded: false });
	};

	return (
		<TableRow className={stylesPositions.positionParent}>
			<td colSpan={6} style={{ position: 'relative' }}>
				<Table style={{ tableLayout: 'fixed' }}>
					<TableBody>
						<Position key={position._id} position={position} onOpenDialogPosition={onOpenDialogPosition} />
						<Position key={childPosition._id} position={childPosition} onOpenDialogPosition={onOpenDialogPosition} />
					</TableBody>
				</Table>
			</td>
		</TableRow>
	);
};

ParentPosition.propTypes = {
	position: PropTypes.object.isRequired,
	childPosition: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		archivePositionAfterEnded: (positionId, data) => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
	};
};

export default connect(null, mapDispatchToProps)(ParentPosition);
