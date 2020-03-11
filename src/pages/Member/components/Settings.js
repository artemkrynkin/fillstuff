import React from 'react';
import { connect } from 'react-redux';

import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import { editMember } from 'src/actions/members';

import stylesGlobal from 'src/styles/globals.module.css';
// import styles from './Settings.module.css';

const Settings = props => {
	const { member, updateMember } = props;

	const onToggleRoles = event => {
		if (event.target.value.length < 1) return;

		props.editMember({ roles: event.target.value }).then(response => {
			if (response.status === 'success') updateMember(response);
		});
	};

	const onToggleSettings = propName => {
		props.editMember({ [propName]: !member[propName] }).then(response => {
			if (response.status === 'success') updateMember(response);
		});
	};

	return (
		<div>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ maxWidth: 450 }} container>
				<InputLabel style={{ minWidth: 110 }}>Роли:</InputLabel>
				<FormControl fullWidth>
					<Select onChange={onToggleRoles} value={member.roles} name="role" multiple>
						<MenuItem value="owner">Владелец</MenuItem>
						<MenuItem value="admin">Администратор</MenuItem>
						<MenuItem value="artist">Мастер</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			{/artist/.test(member.roles) ? (
				<Grid
					className={stylesGlobal.formLabelControl}
					wrap="nowrap"
					alignItems="flex-start"
					style={{ maxWidth: 500, marginBottom: 0 }}
					container
				>
					<InputLabel style={{ minWidth: 110 }}>Настройки списаний:</InputLabel>
					<Grid direction="column" container>
						<FormControl component="fieldset">
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											checked={member.purchaseExpenseStudio}
											onChange={() => onToggleSettings('purchaseExpenseStudio')}
											value="purchaseExpenseStudio"
											color="primary"
											disableRipple
										/>
									}
									label="Может делать списания за счёт студии"
									labelPlacement="end"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={false}
											// onChange={() => onToggleSettings('123')}
											value="123"
											color="primary"
											disableRipple
										/>
									}
									label="Платные позиции предоставляются бесплатно"
									labelPlacement="end"
									disabled
								/>
								<FormControlLabel
									control={
										<Switch
											checked={member.markupPosition}
											onChange={() => onToggleSettings('markupPosition')}
											value="markupPosition"
											color="primary"
											disableRipple
										/>
									}
									label="Включить наценку для платных позиций"
									labelPlacement="end"
									disabled
								/>
							</FormGroup>
						</FormControl>
					</Grid>
				</Grid>
			) : null}
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { member } = ownProps;

	return {
		editMember: memberData => dispatch(editMember({ params: { memberId: member._id }, data: { member: memberData } })),
	};
};

export default connect(null, mapDispatchToProps)(Settings);
