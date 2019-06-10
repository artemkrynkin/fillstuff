import React, { Component } from 'react';
import { compose } from 'redux';
import { cloneDeep, findIndex } from 'lodash';

import { findMemberInProject } from 'shared/roles-access-rights';

import { withCurrentUser } from 'src/components/withCurrentUser';

import Filter from './Filter';
import Calendar from './Calendar';
import Topics from './Topics';

class Index extends Component {
	state = {
		contentPlanEditing: false,
		selectedTopics: [],
	};

	onToggleContentPlanEditing = () => {
		this.setState({
			contentPlanEditing: !this.state.contentPlanEditing,
			selectedTopics: [],
		});
	};

	onSelectTopic = topic => {
		if (!this.state.contentPlanEditing) return;

		const selectedTopics = cloneDeep(this.state.selectedTopics);
		const findSelectedTopic = findIndex(selectedTopics, topic);

		if (!~findSelectedTopic) {
			selectedTopics.push(topic);
		} else {
			selectedTopics.splice(findSelectedTopic, 1);
		}

		this.setState({ selectedTopics: selectedTopics });
	};

	onRemoveSelectedTopic = () => {
		this.setState({ selectedTopics: [] });
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.currentProject._id !== nextProps.currentProject._id) {
			this.setState({
				contentPlanEditing: false,
				selectedTopics: [],
			});
		}
	}

	render() {
		const {
			currentUser,
			currentProject,
			currentUserRole = findMemberInProject(currentUser._id, currentProject).role,
			calendar,
		} = this.props;
		const { contentPlanEditing, selectedTopics } = this.state;

		return (
			<div>
				<Filter currentUser={currentUser} currentProject={currentProject} />
				<Calendar
					currentProject={currentProject}
					offsetTop={['.header', '.pcp-filter']}
					offsetBottom={['.pcp-topics']}
					calendar={calendar}
					contentPlanEditing={contentPlanEditing}
					selectedTopics={selectedTopics}
				/>
				<Topics
					currentProject={currentProject}
					currentUserRole={currentUserRole}
					contentPlanEditing={contentPlanEditing}
					selectedTopics={selectedTopics}
					onToggleContentPlanEditing={this.onToggleContentPlanEditing}
					onSelectTopic={this.onSelectTopic}
					onRemoveSelectedTopic={this.onRemoveSelectedTopic}
				/>
			</div>
		);
	}
}

export default compose(withCurrentUser)(Index);
