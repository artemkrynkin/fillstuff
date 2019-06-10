import { cloneDeep } from 'lodash';

const projects = (
	state = {
		isFetching: false,
		data: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_PROJECTS':
		case 'REQUEST_SOCIAL_PAGES':
		case 'REQUEST_MEMBERS':
		case 'REQUEST_TOPICS': {
			return {
				...state,
				isFetching: true,
			};
		}
		case 'RECEIVE_PROJECTS': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
			};
		}
		case 'CREATE_PROJECT': {
			state.data.push(action.payload);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_PROJECT': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);

			state.data[projectIndex] = {
				...state.data[projectIndex],
				...action.payload.newValues,
			};

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_PROJECT': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);

			state.data.splice(projectIndex, 1);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'CONNECT_SOCIAL_PAGES': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);

			state.data[projectIndex].socialPages = action.payload.socialPages;
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'UPDATE_SOCIAL_PAGE': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);
			const socialPageIndex = state.data[projectIndex].socialPages.findIndex(
				socialPage => socialPage.pageId === action.payload.socialPageId
			);

			state.data[projectIndex].socialPages[socialPageIndex] = {
				...action.payload.newValues,
				updated: true,
			};
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DISCONNECT_SOCIAL_PAGE': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);
			const socialPageIndex = state.data[projectIndex].socialPages.findIndex(
				socialPage => socialPage.pageId === action.payload.socialPageId
			);

			state.data[projectIndex].socialPages.splice(socialPageIndex, 1);
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'MEMBER_INVITATION': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);

			state.data[projectIndex].members = action.payload.members;
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_MEMBER': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);
			const memberIndex = state.data[projectIndex].members.findIndex(member => member._id === action.payload.memberId);

			state.data[projectIndex].members[memberIndex].role = action.payload.newValues.role;
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_MEMBER': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);
			const memberIndex = state.data[projectIndex].members.findIndex(member => member._id === action.payload.memberId);

			state.data[projectIndex].members.splice(memberIndex, 1);
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'CREATE_TOPIC': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);

			state.data[projectIndex].topics = action.payload.topics;
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'EDIT_TOPIC': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);
			const topicIndex = state.data[projectIndex].topics.findIndex(topic => topic._id === action.payload.topicId);

			state.data[projectIndex].topics[topicIndex] = action.payload.newValues;
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'DELETE_TOPIC': {
			const projectIndex = state.data.findIndex(project => project._id === action.payload.projectId);
			const topicIndex = state.data[projectIndex].topics.findIndex(topic => topic._id === action.payload.topicId);

			state.data[projectIndex].topics.splice(topicIndex, 1);
			state.data[projectIndex] = cloneDeep(state.data[projectIndex]);

			return {
				...state,
				isFetching: false,
			};
		}
		case 'UNAUTHORIZED_USER': {
			return {
				...state,
				data: action.payload,
				isFetching: false,
				error: 'unauthorized',
			};
		}
		default:
			return state;
	}
};

export default projects;
