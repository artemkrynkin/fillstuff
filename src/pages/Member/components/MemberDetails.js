import React, { useState } from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import CardPaper from 'src/components/CardPaper';

import Invoices from './Invoices';

import styles from './MemberDetails.module.css';

const MemberDetails = props => {
	const { member, invoicesData } = props;
	const [tabName, setTabName] = useState('invoices');

	const onChangeTab = (event, tabName) => {
		setTabName(tabName);
	};

	return (
		<CardPaper
			leftContent={
				<Tabs className={styles.tabs} value={tabName} onChange={onChangeTab} aria-label="simple tabs example">
					<Tab value="invoices" label="Счета" id="invoices" />
					<Tab value="settings" label="Настройки" id="settings" />
				</Tabs>
			}
			style={{ marginTop: 16 }}
		>
			{tabName === 'invoices' ? (
				<Invoices member={member} invoicesData={invoicesData} />
			) : tabName === 'settings' ? (
				<div>Настройки</div>
			) : null}
		</CardPaper>
	);
};

export default MemberDetails;
