import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import AvatarTitle from 'src/components/AvatarTitle';
import Money from 'src/components/Money';

import stylesGlobal from '../../containers/Notification.module.css';
import styles from './MemberInvoice.module.css';

const MemberInvoice = props => {
	const {
		notification: { invoice },
		onOpenDialogByName,
	} = props;

	return (
		<Fragment>
			<div className={stylesGlobal.header}>
				<FontAwesomeIcon className={stylesGlobal.notificationIcon} icon={['fal', 'receipt']} />
				<Typography className={stylesGlobal.title} variant="h6">
					Счет за платные позиции
				</Typography>
			</div>
			<div>
				<AvatarTitle
					classNames={{
						container: styles.user,
					}}
					imageSrc={invoice.member.user.avatar}
					title={invoice.member.user.name}
				/>
				<Grid justify="space-between" alignItems="center" container>
					<Grid item>
						<div className={stylesGlobal.totalPrice}>
							<Money value={invoice.amount - invoice.paymentAmountDue} />
						</div>
					</Grid>
					<Grid item>
						<Button
							onClick={() => onOpenDialogByName('dialogInvoicePaymentCreate', 'invoice', invoice)}
							variant="outlined"
							color="primary"
							size="small"
						>
							Погасить счет
						</Button>
					</Grid>
				</Grid>
			</div>
		</Fragment>
	);
};

export default MemberInvoice;
