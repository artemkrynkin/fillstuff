import React from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const Index = props => {
	return (
		<Container>
			<View {...props} />
		</Container>
	);
};

export default Index;
