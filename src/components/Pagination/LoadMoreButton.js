import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const LoadMoreButton = props => {
	const { page, setPage, onLoadMore, filter } = props;

	const onHandleLoadMore = () => {
		if (!filter) {
			const nextPage = page + 1;

			setPage(nextPage);

			onLoadMore(nextPage);
		} else {
			onLoadMore();
		}
	};

	return (
		<Grid style={{ marginTop: 20 }} container>
			<Button variant="outlined" color="primary" onClick={onHandleLoadMore} fullWidth>
				Показать ещё
			</Button>
		</Grid>
	);
};

LoadMoreButton.propTypes = {
	page: PropTypes.number,
	setPage: PropTypes.func,
	onLoadMore: PropTypes.func.isRequired,
	filter: PropTypes.bool,
};

export default LoadMoreButton;
