import React from 'react';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import { formatNumber } from 'shared/utils';

import { DefinitionList, DefinitionListItem } from 'src/components/Definition';
import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import UserSummary from 'src/components/UserSummary';

import OrderedReceiptPosition from './OrderedReceiptPosition';

import styles from './index.module.css';

const momentDate = moment();

const Content = props => {
	const { procurement } = props;

	const isCurrentYear = momentDate.isSame(procurement.deliveryDate, 'year');
	const deliveryDate = moment(procurement.deliveryDate).format(isCurrentYear ? 'D MMMM' : 'D MMMM YYYY');

	return (
		<DialogContent style={{ overflow: 'initial' }}>
			<Typography variant="h6" gutterBottom>
				Информация по заказу
			</Typography>
			<DefinitionList>
				<DefinitionListItem
					term="Заказ от"
					value={<UserSummary src={procurement.orderedByMember.user.picture} title={procurement.orderedByMember.user.name} size="xs" />}
				/>
				<DefinitionListItem term="Магазин" value={procurement.shop.name} />
				{procurement.isConfirmed ? (
					<DefinitionListItem
						term="Дата доставки"
						value={
							!procurement.isUnknownDeliveryDate ? (
								<>
									{deliveryDate}{' '}
									{procurement.deliveryTimeFrom && procurement.deliveryTimeTo
										? procurement.deliveryTimeFrom !== procurement.deliveryTimeTo
											? `с ${procurement.deliveryTimeFrom} до ${procurement.deliveryTimeTo}`
											: `в ${procurement.deliveryTimeFrom}`
										: null}
								</>
							) : (
								'Дата доставки не известна'
							)
						}
					/>
				) : null}
				<DefinitionListItem
					term="Итого"
					value={
						<NumberFormat
							value={formatNumber(procurement.totalPrice, { toString: true })}
							renderText={value => value}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
					}
				/>
				<DefinitionListItem
					term="Стоимость позиций"
					value={
						<NumberFormat
							value={formatNumber(procurement.pricePositions, { toString: true })}
							renderText={value => value}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
					}
				/>
				<DefinitionListItem
					term="Стоимость доставки"
					value={
						<NumberFormat
							value={formatNumber(procurement.costDelivery, { toString: true })}
							renderText={value => value}
							displayType="text"
							{...currencyMoneyFormatProps}
						/>
					}
				/>
				{procurement.comment ? (
					<DefinitionListItem term="Комментарий" value={<div className={styles.comment}>{procurement.comment}</div>} />
				) : null}
			</DefinitionList>

			<Typography variant="h6" style={{ marginTop: 40 }} gutterBottom>
				Позиции в заказе
			</Typography>
			{procurement.orderedReceiptsPositions.length
				? procurement.orderedReceiptsPositions.map((orderedReceiptPosition, index) => (
						<OrderedReceiptPosition
							key={orderedReceiptPosition.position._id}
							index={index}
							orderedReceiptPosition={orderedReceiptPosition}
						/>
				  ))
				: null}
		</DialogContent>
	);
};

export default Content;
