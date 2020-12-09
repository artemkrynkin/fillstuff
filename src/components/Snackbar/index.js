import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';

import { removeSnackbar } from 'src/actions/snackbars';

let displayed = [];

const Snackbar = props => {
	const { snackbars, removeSnackbar } = props;
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const storeDisplayed = id => {
		displayed = [...displayed, id];
	};

	const removeDisplayed = id => {
		displayed = [...displayed.filter(key => id !== key)];
	};

	useEffect(() => {
		snackbars.forEach(({ key, message, options = {}, dismissed = false }) => {
			if (dismissed) {
				// dismiss snackbar using notistack
				closeSnackbar(key);
				return;
			}

			// do nothing if snackbar is already displayed
			if (displayed.includes(key)) return;

			// display snackbar using notistack
			enqueueSnackbar(message, {
				key,
				action: key => (
					<IconButton className="close" onClick={() => closeSnackbar(key)} size="small">
						<FontAwesomeIcon icon={['fal', 'times']} />
					</IconButton>
				),
				...options,
				onClose: (event, reason, myKey) => {
					if (options.onClose) {
						options.onClose(event, reason, myKey);
					}
				},
				onExited: (event, myKey) => {
					// removen this snackbar from redux store
					removeSnackbar(myKey);
					removeDisplayed(myKey);
				},
			});

			// keep track of snackbars that we've displayed
			storeDisplayed(key);
		});
	}, [snackbars, closeSnackbar, enqueueSnackbar, removeSnackbar]);

	return null;
};

const mapStateToProps = state => {
	return {
		snackbars: state.snackbars.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		removeSnackbar: key => dispatch(removeSnackbar(key)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
