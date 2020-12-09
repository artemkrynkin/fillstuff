import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import UserSummary from 'src/components/UserSummary';
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
				<UserSummary className={styles.user} src={invoice.member.user.picture} title={invoice.member.user.name} size="xs" />
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
