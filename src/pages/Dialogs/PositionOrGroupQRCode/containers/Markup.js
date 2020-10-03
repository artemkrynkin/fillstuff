import React, { useLayoutEffect, memo, useMemo } from 'react';
import QRCode from 'qrcode';
import ClassNames from 'classnames';

import { Grid } from '@material-ui/core';

import { qrRender } from 'src/helpers/qrRender';

import PositionSummary from 'src/components/PositionSummary';

import { getDiagonalSize, calculatePPI, calculateCmPerPx } from '../helpers/renderOptions';

import styles from './Markup.module.css';

const ppi = calculatePPI({
	resolutionString: `${window.screen.width * window.devicePixelRatio}x${window.screen.height * window.devicePixelRatio}`,
	diagonalSize: getDiagonalSize(),
});

const Markup = props => {
	const { selectedPositionOrGroup, qrData, qrCodeSvg, setQrCodeSvg, stickerOptions } = props;

	const stickerSizeMemoized = useMemo(() => calculateCmPerPx(ppi, 210, stickerOptions.stickerSize), [stickerOptions.stickerSize]);
	const stickerWidthMemoized = useMemo(() => calculateCmPerPx(ppi, 210, stickerOptions.stickerWidth), [stickerOptions.stickerWidth]);
	const stickerColorMemoized = useMemo(() => stickerOptions.stickerColor, [stickerOptions.stickerColor]);

	const stickerOrientationSize =
		stickerOptions.stickerOrientation === 'portrait'
			? { width: stickerSizeMemoized }
			: { height: stickerSizeMemoized, width: stickerWidthMemoized };
	const qrSize = stickerOptions.stickerOrientation === 'landscape' ? { width: stickerSizeMemoized - 40 } : null;

	const stickerTitleEnable =
		stickerOptions.printDestination === 'storage' &&
		((stickerOptions.stickerOrientation === 'portrait' && stickerOptions.stickerSize > 3) ||
			stickerOptions.stickerOrientation === 'landscape');

	useLayoutEffect(() => {
		const options = { color: stickerColorMemoized };
		const qrSvg = qrRender(QRCode.create(qrData, { errorCorrectionLevel: 'Q' }), options);

		setQrCodeSvg(qrSvg);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stickerColorMemoized]);

	return (
		<Grid className={styles.container} xs={8} item>
			<Grid className={styles.containerInner} justify="space-between" direction="column" container>
				<div className={styles.markup}>
					<div className={styles.markupScroll}>
						<div
							className={ClassNames({
								[styles.stickerContainer]: true,
								[styles.stickerOrientationLandscape]: stickerOptions.stickerOrientation === 'landscape',
								[styles.stickerColorBlackWhite]: stickerOptions.stickerColor === 'blackWhite',
							})}
							style={stickerOrientationSize}
						>
							<div className={styles.qrContainer} dangerouslySetInnerHTML={{ __html: qrCodeSvg }} style={qrSize} />
							{stickerTitleEnable ? (
								<div className={styles.titleContainer} style={{ fontSize: `${stickerOptions.titleSize}pt` }}>
									{selectedPositionOrGroup.name}
								</div>
							) : null}
						</div>
					</div>
				</div>
				<div className={styles.footer}>
					<PositionSummary
						className={styles.positionName}
						name={selectedPositionOrGroup.name}
						characteristics={!selectedPositionOrGroup.childPosition ? selectedPositionOrGroup.characteristics : null}
					/>
				</div>
			</Grid>
		</Grid>
	);
};

export default memo(Markup);
