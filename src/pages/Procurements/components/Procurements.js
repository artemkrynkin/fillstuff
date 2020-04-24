import React, { Component } from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Empty from 'src/components/Empty';
import { deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getProcurementsExpected, getProcurementsReceived } from 'src/actions/procurements';

import ProcurementsExpected from './ProcurementsExpected';
import ProcurementsReceived from './ProcurementsReceived';
import styles from './Procurements.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';
import { LoadingComponent } from '../../../components/Loading';

class Procurements extends Component {
	onLoadMoreProcurementsReceived = nextPage => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams, page: nextPage }, { type: 'server', ...filterDeleteParams });

		this.props.getProcurementsReceived(query, { mergeData: true });
	};

	componentDidMount() {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		this.props.getProcurementsExpected();
		this.props.getProcurementsReceived(query);
	}

	render() {
		const {
			filterOptions,
			paging,
			procurementsExpected: {
				data: procurementsExpected,
				// isFetching: isLoadingProcurementsExpected,
				// error: errorProcurementsExpected
			},
			procurementsReceived: {
				data: procurementsReceived,
				// isFetching: isLoadingProcurementsReceived,
				// error: errorProcurementsReceived
			},
		} = this.props;
		const { procurementsExpected: procurementsExpectedInitial, procurementsReceived: procurementsReceivedInitial } = this.props;

		if (!procurementsExpected && !procurementsReceived) return <LoadingComponent className={styles.container} />;

		if (
			procurementsExpected &&
			procurementsReceived &&
			!procurementsExpected.paging.totalCount &&
			!procurementsReceived.paging.totalCount &&
			!procurementsReceived.paging.totalDocs
		) {
			return (
				<Empty
					className={styles.empty}
					imageSrc={emptyImage}
					content={
						<Typography variant="h6" gutterBottom>
							Похоже, у вас еще нет заказов или закупок
						</Typography>
					}
					actions={
						<Grid justify="center" alignItems="center" container>
							<Button variant="contained" color="primary">
								Создать заказ
							</Button>
							<Typography variant="caption" style={{ marginLeft: 16 }}>
								или
							</Typography>
							<Button variant="contained" color="primary">
								Оформить закупку
							</Button>
						</Grid>
					}
				/>
			);
		}

		return (
			<Grid>
				<ProcurementsExpected procurementsExpected={procurementsExpectedInitial} />
				<ProcurementsReceived
					filterOptions={filterOptions}
					paging={paging}
					procurementsReceived={procurementsReceivedInitial}
					onLoadMore={this.onLoadMoreProcurementsReceived}
				/>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		procurementsExpected: state.procurementsExpected,
		procurementsReceived: state.procurementsReceived,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProcurementsExpected: options => dispatch(getProcurementsExpected({ ...options })),
		getProcurementsReceived: (query, options) => dispatch(getProcurementsReceived({ query, ...options })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Procurements);
