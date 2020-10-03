import colorTheme from 'shared/colorTheme';

export default ({
	title,
	printDestination,
	quantity,
	stickerOrientation,
	stickerSize,
	stickerWidth,
	titleSize,
	stickerColor,
	qrCodeSvg,
}) => {
	const PAGE_A4_PX = 595.28;
	const PAGE_A4_MM = 210;
	const CM_PER_PX = (PAGE_A4_PX / PAGE_A4_MM) * 10;
	const PAGE_MARGINS = {
		horizontal: CM_PER_PX,
		vertical: printDestination === 'storage' ? CM_PER_PX : CM_PER_PX * 2,
	};
	const STICKER_PADDING = 15;
	const STICKER_SIZE = stickerSize * CM_PER_PX - STICKER_PADDING * 2;
	const STICKER_WIDTH = stickerWidth * CM_PER_PX - STICKER_PADDING * 2;
	const COLS = Math.floor((PAGE_A4_PX - PAGE_MARGINS.horizontal * 2) / (STICKER_SIZE + STICKER_PADDING * 2));
	const ROWS = Math.ceil(quantity / COLS);

	let content = [
		{
			table: {
				body: [],
				dontBreakRows: true,
				widths: [],
			},
			layout: {
				paddingLeft: () => STICKER_PADDING,
				paddingRight: () => STICKER_PADDING,
				paddingTop: () => STICKER_PADDING,
				paddingBottom: () => STICKER_PADDING,
				hLineColor: () => colorTheme.blueGrey['200'],
				vLineColor: () => colorTheme.blueGrey['200'],
				hLineStyle: () => ({ dash: { length: 5, space: 5 } }),
				vLineStyle: () => ({ dash: { length: 5, space: 5 } }),
			},
		},
	];
	let generatedQRs = 0;

	for (let column = 1; column <= COLS; column++)
		content[0].table.widths.push(stickerOrientation === 'portrait' ? STICKER_SIZE : STICKER_WIDTH);

	for (let row = 1; row <= ROWS; row++) {
		const rowContent = [];

		for (let column = 1; column <= COLS; column++) {
			let contentColumn =
				stickerOrientation !== 'portrait'
					? [
							{
								table: {
									body: [[]],
									dontBreakRows: true,
									widths: [STICKER_SIZE, STICKER_WIDTH - STICKER_SIZE],
								},
								layout: 'noBorders',
							},
					  ]
					: [];

			if (generatedQRs < quantity) {
				const titleObj = {
					alignment: 'center',
					bold: true,
					color: stickerColor === 'colored' ? colorTheme.slateGrey[3] : '#000000',
					fontSize: titleSize,
					margin: stickerOrientation === 'portrait' ? [0, 0, 0, 15] : [15, 0, 15, 0],
					text: title,
					preserveLeadingSpaces: true,
				};
				const qrCodeObj = {
					alignment: 'center',
					fit: [STICKER_SIZE, STICKER_SIZE],
					svg: qrCodeSvg,
				};

				if (stickerOrientation === 'portrait') {
					if (titleSize) contentColumn.push(titleObj);

					contentColumn.push(qrCodeObj);
				} else {
					contentColumn[0].table.body[0].push(qrCodeObj);

					if (titleSize) contentColumn[0].table.body[0].push(titleObj);
				}

				generatedQRs += 1;
			} else {
				contentColumn = { text: '', border: [false, false, false, false] };
			}

			rowContent.push(contentColumn);
		}

		content[0].table.body.push(rowContent);
	}

	return {
		pageSize: {
			height: 842,
			width: PAGE_A4_PX,
		},
		pageMargins: Object.values(PAGE_MARGINS),
		pageOrientation: stickerOrientation,
		header:
			printDestination === 'eachUnit'
				? {
						text: title,
						fontSize: 14,
						bold: true,
						margin: [CM_PER_PX, CM_PER_PX, CM_PER_PX, 0],
				  }
				: null,
		content,
		footer:
			printDestination === 'eachUnit'
				? (currentPage, pageCount) => {
						return {
							columns: [
								// { text: `QR коды: ${currentPage} из ${pageCount}`, fontSize: 11 },
								{ text: `Страница: ${currentPage} из ${pageCount}`, fontSize: 11, alignment: 'right' },
							],
							margin: [CM_PER_PX, 0, CM_PER_PX, CM_PER_PX],
						};
				  }
				: null,
	};
};
