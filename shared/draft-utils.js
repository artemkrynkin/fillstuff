import EditorState from 'draft-js/lib/EditorState';
import ContentState from 'draft-js/lib/ContentState';
import convertFromRaw from 'draft-js/lib/convertFromRawToDraftState';
import convertToRaw from 'draft-js/lib/convertFromDraftStateToRaw';

const toPlainText = function toPlainText(editorState) {
	return editorState.getCurrentContent().getPlainText();
};

// This is necessary for SSR, if you create an empty editor on the server and on the client they have to
// have matching keys, so just doing fromPlainText('') breaks checksum matching because the key
// of the block is randomly generated twice and thusly does't match
const emptyContentState = convertFromRaw({
	entityMap: {},
	blocks: [
		{
			text: '',
			key: 'foo',
			type: 'unstyled',
			entityRanges: [],
		},
	],
});

const fromPlainText = function fromPlainText(text) {
	if (!text || text === '') return EditorState.createWithContent(emptyContentState);
	return EditorState.createWithContent(ContentState.createFromText(text));
};

const toJSON = function toJSON(editorState) {
	return convertToRaw(editorState.getCurrentContent());
};

const toState = function toState(json) {
	return EditorState.createWithContent(convertFromRaw(json));
};

const isAndroid = function isAndroid() {
	return navigator.userAgent.toLowerCase().indexOf('android') > -1;
};

export default {
	toJSON: toJSON,
	toState: toState,
	toPlainText: toPlainText,
	fromPlainText: fromPlainText,
	emptyContentState: emptyContentState,
	isAndroid: isAndroid,
};
