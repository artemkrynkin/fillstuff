import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';

import './Filter.styl';

const Filter = () => {
	return (
		<div className="project-publications-filter">
			<div className="project-publications-filter__actions">
				<IconButton className="project-publications-filter__add-social-profile">
					<FontAwesomeIcon icon={['fal', 'plus']} />
				</IconButton>
				<IconButton className="project-publications-filter__remove-social-profile">
					<FontAwesomeIcon icon={['far', 'trash-alt']} />
				</IconButton>
			</div>
			<div className="project-publications-filter__profiles-wrap">
				<div className="project-publications-filter__profile">
					<div className="project-publications-filter__social-network-profile project-publications-filter__social-network-profile_vk">
						<FontAwesomeIcon icon={['fab', 'vk']} />
					</div>
					<div className="project-publications-filter__profile-photo">
						<img src="https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg" alt="" />
					</div>
				</div>
				<div className="project-publications-filter__profile">
					<div className="project-publications-filter__social-network-profile project-publications-filter__social-network-profile_instagram">
						<FontAwesomeIcon icon={['fab', 'instagram']} />
					</div>
					<div className="project-publications-filter__profile-photo">
						<img src="https://pp.userapi.com/c845417/v845417940/9e9ce/sd3TMoD33VU.jpg" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Filter;
