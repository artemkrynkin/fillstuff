import { printDestination } from 'shared/checkPositionAndReceipt';

export const stickerWidthMax = stickerSize => {
	const stickerWidth = Math.floor(
		(renderOptions.stickerWidth.length / renderOptions.stickerSize.length) * stickerSize + renderOptions.stickerWidth[0]
	);
	const minStickerWidth = renderOptions.stickerWidth[0];
	const maxStickerWidth = renderOptions.stickerWidth[renderOptions.stickerWidth.length - 1];

	return stickerWidth > maxStickerWidth ? maxStickerWidth : stickerWidth < minStickerWidth ? minStickerWidth : stickerWidth;
};

export const stickerWidthOptimal = stickerWidthMax => {
	return stickerWidthMax - renderOptions.stickerWidth[0];
};

export const titleSizeMax = stickerSize => {
	const titleSize = Math.floor(
		(renderOptions.titleSize.length / renderOptions.stickerSize.length) * stickerSize + renderOptions.titleSize[0]
	);
	const minTitleSize = renderOptions.titleSize[0];
	const maxTitleSize = renderOptions.titleSize[renderOptions.titleSize.length - 1];

	return titleSize > maxTitleSize ? maxTitleSize : titleSize < minTitleSize ? minTitleSize : titleSize;
};

export const titleSizeOptimal = titleSizeMax => {
	return titleSizeMax - Math.round((titleSizeMax - renderOptions.titleSize[0]) / 2);
};

export const getDiagonalSize = () => Math.ceil(window.screen.width / 96.358115);

/**
 * @param resolutionString - string like '1920x1080' or '1920X1080'
 * @returns {{width: number, height: number}}
 */
export const parseResolutionString = ({ resolutionString }) => {
	const [width, height] = resolutionString.toLowerCase().split('x');

	return {
		height: Number.parseInt(height),
		width: Number.parseInt(width),
	};
};

/**
 * @param resolutionString - resolution string like 1920x1080
 * @param diagonalSize - screen diagonal size in inches
 * @param width - screen width in pixels
 * @param height - screen height in pixels
 * @returns {number|*|undefined}
 */
export const calculatePPI = ({ resolutionString, diagonalSize, width, height }) => {
	if (resolutionString && diagonalSize !== undefined) {
		const { width, height } = parseResolutionString({ resolutionString });

		return Math.round(calculatePPI({ width, height, diagonalSize }));
	} else if (width > 0 && height > 0 && diagonalSize > 0) {
		return Math.round((Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / diagonalSize) * 100) / 100;
	}
};

export const calculateCmPerPx = (ppi, mm, cm) => {
	return Math.ceil(((8.27 * (ppi / window.devicePixelRatio)) / mm) * 10 * cm);
};

export const renderOptionsTranslate = {
	printDestination: {
		storage: 'На место хранения',
		eachUnit: 'На каждую единицу',
	},
	stickerColor: {
		colored: 'Цветной',
		blackWhite: 'Чёрно-белый',
	},
	stickerOrientation: {
		portrait: 'Книжная',
		landscape: 'Альбомная',
	},
};

const renderOptions = {
	printDestination,
	stickerOrientation: ['portrait', 'landscape'],
	stickerSize: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	stickerWidth: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
	titleSize: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
	stickerColor: ['colored', 'blackWhite'],
};

export default renderOptions;
