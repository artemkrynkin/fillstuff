import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadMoreButton = props => {
	const { page, setPage, onLoadMore, filter, loading } = props;

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
				{loading ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
				<span className="loading-button-label" style={{ opacity: Number(!loading) }}>
					Показать ещё
				</span>
			</Button>
		</Grid>
	);
};

LoadMoreButton.propTypes = {
	page: PropTypes.number,
	setPage: PropTypes.func,
	onLoadMore: PropTypes.func.isRequired,
	filter: PropTypes.bool,
	loading: PropTypes.bool,
};

export default LoadMoreButton;
