import React, { useEffect, useState } from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Shop from './Shop';

import { TableCell } from './styles';
import styles from './Shops.module.css';

const Shops = props => {
	const { position } = props;
	const [showShops, setShowShops] = useState(4);
	const [lastShop, setLastShop] = useState(null);
	const [otherShops, setOtherShops] = useState(null);

	const onShowShops = length => setShowShops(length);

	useEffect(() => {
		if (position.shops.length) {
			const allShops = position.shops
				.slice()
				.sort((aShop, bShop) =>
					aShop.lastProcurement && bShop.lastProcurement
						? new Date(bShop.lastProcurement.createdAt) - new Date(aShop.lastProcurement.createdAt)
						: -1
				);

			setLastShop(allShops[0]);
			allShops.splice(0, 1);
			setOtherShops(allShops);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{otherShops ? (
				<div className={styles.lastShop}>
					<Typography className={styles.title} variant="h6">
						Последний магазин закупки
					</Typography>

					<Table style={{ tableLayout: 'fixed', margin: '0' }}>
						<TableHead className={styles.tableHeaderSticky}>
							<TableRow>
								<TableCell>Магазин</TableCell>
								<TableCell>Дата последней закупки</TableCell>
								<TableCell align="right" width={180}>
									Стоимость доставки
								</TableCell>
								<TableCell align="right" width={140}>
									Количество
								</TableCell>
								<TableCell align="right" width={140}>
									Цена покупки
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<Shop position={position} shop={lastShop} />
						</TableBody>
					</Table>
				</div>
			) : null}

			{otherShops && otherShops.length ? (
				<div className={styles.otherShops}>
					<Typography className={styles.title} variant="h6">
						Другие магазины для закупки
					</Typography>

					<Table style={{ tableLayout: 'fixed', margin: '0' }}>
						<TableHead className={styles.tableHeaderSticky}>
							<TableRow>
								<TableCell>Магазин</TableCell>
								<TableCell>Дата последней закупки</TableCell>
								<TableCell align="right" width={180}>
									Стоимость доставки
								</TableCell>
								<TableCell align="right" width={140}>
									Количество
								</TableCell>
								<TableCell align="right" width={140}>
									Цена покупки
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{otherShops.map((shop, index) => {
								if (index + 1 > showShops) return null;

								return <Shop key={shop._id} position={position} shop={shop} />;
							})}
						</TableBody>
					</Table>

					{otherShops.length > showShops ? (
						<Grid className={styles.showShops} justifyContent="center" container>
							<Button onClick={() => onShowShops(otherShops.length)} variant="outlined" size="small">
								Показать все магазины
							</Button>
						</Grid>
					) : null}
				</div>
			) : null}
		</>
	);
};

export default Shops;
