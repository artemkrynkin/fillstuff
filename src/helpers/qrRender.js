const removeModules = ({ matrix, removeFinderPattern = false, removeCenterModules = false }) => {
	let size = matrix.size;

	const finderPatternModules = removeFinderPattern ? size - 7 : 0;
	const centerModules = removeCenterModules ? (size - 7 * 3) / 2 + 7 : 0;

	let pos = [
		// top-left
		[0, 0],
		// top-right
		[finderPatternModules, 0],
		// center
		[centerModules, centerModules],
		// bottom-left
		[0, finderPatternModules],
	];

	for (let i = 0; i < pos.length; i++) {
		let row = pos[i][0];
		let col = pos[i][1];

		for (let r = -1; r <= 7; r++) {
			if (row + r <= -1 || size <= row + r) continue;

			for (let c = -1; c <= 7; c++) {
				if (col + c <= -1 || size <= col + c) continue;

				matrix.set(row + r, col + c, false, true);
			}
		}
	}
};

const qrModulesDataRender = (data, size, moduleSize) => {
	let svg = '';

	for (let i = 0; i < data.length; i++) {
		const col = Math.floor(i % size);
		const prevCol = col - 1;
		const nextCol = col + 1;
		const row = Math.floor(i / size);

		const currentValue = data[i];
		const prevValue = col && Boolean(data[i - 1]);
		const nextValue = nextCol !== size && Boolean(data[i + 1]);
		const prevValueTRow = Boolean(data[i - size]);
		const nextValueBRow = Boolean(data[i + size]);
		const prevValueTRowPrevCol = Boolean(data[i - 1 - size]);
		const nextValueBRowPrevCol = Boolean(data[i - 1 + size]);
		const prevValueTRowNextCol = Boolean(data[i + 1 - size]);
		const nextValueBRowNextCol = Boolean(data[i + 1 + size]);

		let moduleStyle = '';

		if (currentValue) {
			if (col && !prevValue && nextValueBRow && nextValueBRowPrevCol) {
				moduleStyle = 'n_rb';

				svg += `<g transform="translate(${prevCol * moduleSize}, ${row * moduleSize})"><use xlink:href="#${moduleStyle}"/></g>`;
			}

			if (col && !prevValue && prevValueTRow && prevValueTRowPrevCol) {
				moduleStyle = 'n_rt';

				svg += `<g transform="translate(${prevCol * moduleSize}, ${row * moduleSize})"><use xlink:href="#${moduleStyle}"/></g>`;
			}

			if (nextCol !== size && !nextValue && nextValueBRow && nextValueBRowNextCol) {
				moduleStyle = 'n_lb';

				svg += `<g transform="translate(${nextCol * moduleSize}, ${row * moduleSize})"><use xlink:href="#${moduleStyle}"/></g>`;
			}

			if (nextCol !== size && !nextValue && prevValueTRow && prevValueTRowNextCol) {
				moduleStyle = 'n_lt';

				svg += `<g transform="translate(${nextCol * moduleSize}, ${row * moduleSize})"><use xlink:href="#${moduleStyle}"/></g>`;
			}

			if (!prevValue && nextValue && prevValueTRow && !nextValueBRow) {
				moduleStyle = 'rt';
			} else if (!prevValue && nextValue && !prevValueTRow && nextValueBRow) {
				moduleStyle = 'rb';
			} else if (prevValue && !nextValue && !prevValueTRow && nextValueBRow) {
				moduleStyle = 'lb';
			} else if (prevValue && !nextValue && prevValueTRow && !nextValueBRow) {
				moduleStyle = 'lt';
			} else if (!prevValue && !nextValue && prevValueTRow && !nextValueBRow) {
				moduleStyle = 't';
			} else if (prevValue && !nextValue && !prevValueTRow && !nextValueBRow) {
				moduleStyle = 'l';
			} else if (!prevValue && nextValue && !prevValueTRow && !nextValueBRow) {
				moduleStyle = 'r';
			} else if (!prevValue && !nextValue && !prevValueTRow && nextValueBRow) {
				moduleStyle = 'b';
			} else if (!prevValue && !nextValue && !prevValueTRow && !nextValueBRow) {
				moduleStyle = 'empty';
			} else {
				moduleStyle = 'rect';
			}

			svg += `<g transform="translate(${col * moduleSize}, ${row * moduleSize})"><use xlink:href="#${moduleStyle}"/></g>`;
		}
	}

	return svg;
};

export const qrRender = (qrData, customOptions, cb) => {
	const options = {
		color: 'colored',
		logo: 'fillstuff',
		...customOptions,
	};

	removeModules({
		matrix: qrData.modules,
		removeFinderPattern: true,
		removeCenterModules: options.logo !== 'none',
	});

	const data = qrData.modules.data;
	const size = qrData.modules.size;
	const moduleSize = 97;
	const moduleColor = options.color === 'colored' ? '#2B3544' : '#000000';
	const logoModule1Color = options.color === 'colored' ? '#00BFA5' : '#ffffff';
	const logoModule2Color = options.color === 'colored' ? '#FFC74A' : '#ffffff';
	const logoModule3Color = options.color === 'colored' ? '#DD5B5B' : '#ffffff';

	const logoSvg = `
    <g id="fillstuff_logo" stroke="none" stroke-width="1" fill="none">
      <rect fill="currentColor" x="0" y="0" width="${moduleSize * 7}" height="${moduleSize * 7}" rx="150"/>
      <g transform="translate(130, 130) scale(15)">
        <path fill="${logoModule1Color}" d="M5.86241276,8.09571286 C5.86241276,6.86229527 6.86229527,5.86241276 8.09571286,5.86241276 L20.0159522,5.86241276 C20.4784837,5.86241276 20.8534397,5.48745682 20.8534397,5.02492522 L20.8534397,3.62911266 C20.8534397,1.62480909 19.2286306,1.22728198e-16 17.2243271,0 L0.837487537,0 C0.374955942,-2.83218919e-17 5.66437837e-17,0.374955942 0,0.837487537 L0,17.2243271 C2.45456396e-16,19.2286306 1.62480909,20.8534397 3.62911266,20.8534397 L5.02492522,20.8534397 C5.48745682,20.8534397 5.86241276,20.4784837 5.86241276,20.0159522 L5.86241276,8.09571286 Z"/>
        <path fill="${logoModule2Color}" d="M13.5393819,15.7726819 C13.5393819,14.5392643 14.5392643,13.5393819 15.7726819,13.5393819 L23.449651,13.5393819 C23.6717666,13.5393819 23.8847848,13.4511468 24.0418441,13.2940875 C24.1989036,13.137028 24.2871386,12.9240098 24.2871386,12.7018943 L24.2871386,11.3060818 C24.2871386,9.30177815 22.6623295,7.67696909 20.6580259,7.67696909 L8.51445663,7.67696909 C8.05192504,7.67696909 7.67696909,8.05192504 7.67696909,8.51445663 L7.67696909,20.6580259 C7.67696909,22.6623295 9.30177815,24.2871386 11.3060818,24.2871386 L12.7018943,24.2871386 C12.9240098,24.2871386 13.137028,24.1989036 13.2940875,24.0418441 C13.4511468,23.8847848 13.5393819,23.6717666 13.5393819,23.449651 L13.5393819,15.7726819 Z"/>
        <path fill="${logoModule3Color}" d="M16.1914257,15.3539382 L24.3708874,15.3539382 C26.3751909,15.3539382 28,16.9787473 28,18.9830509 L28,24.3708874 C28,26.3751909 26.3751909,28 24.3708874,28 L18.9830509,28 C16.9787473,28 15.3539382,26.3751909 15.3539382,24.3708874 L15.3539382,16.1914257 C15.3539382,15.7288941 15.7288941,15.3539382 16.1914257,15.3539382 Z"/>
      </g>
    </g>
	`;
	const logoSvgMask = `
	  <use fill="none" fill-rule="evenodd" transform="translate(${((size - 7 * 3) / 2 + 7) * moduleSize}, ${((size - 7 * 3) / 2 + 7) *
		moduleSize})" xlink:href="#fillstuff_logo"/>
	`;

	const imageSvg = `
    <g id="image_center">
      <defs>
        <pattern id="image" x="0" y="0" height="100%" width="100%" viewBox="0 0 300 300">
          <image x="0" y="0" width="300" height="300" xlink:href="${options.image}"/>
        </pattern>
      </defs>
      <rect fill="url(#image)" x="0" y="0" width="${moduleSize * 7}" height="${moduleSize *
		7}" rx="50%" stroke="rgba(0, 0, 0, 0.1)" stroke-width="0.2%"/>
    </g>
	`;
	const imageSvgMask = `
	  <use fill="none" fill-rule="evenodd" transform="translate(${((size - 7 * 3) / 2 + 7) * moduleSize}, ${((size - 7 * 3) / 2 + 7) *
		moduleSize})" xlink:href="#image_center"/>
	`;

	const qrSvg = `
<svg viewBox="0 0 ${moduleSize * size} ${moduleSize *
		size}" width="250px" height="250px" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <rect id="rect" width="100" height="100" fill="currentColor"/>
    <path id="empty" d="M0,28.6v42.9C0,87.3,12.8,100,28.6,100h42.9c15.9,0,28.6-12.8,28.6-28.6V28.6C100,12.7,87.2,0,71.4,0H28.6 C12.8,0,0,12.8,0,28.6z" fill="currentColor"/>
    <path id="b" d="M0,0 L66,0 C84.7776815,-3.44940413e-15 100,15.2223185 100,34 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" transform="rotate(-90 50 50)" fill="currentColor"/>
    <path id="r" d="M0,0 L66,0 C84.7776815,-3.44940413e-15 100,15.2223185 100,34 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" transform="rotate(-180 50 50)" fill="currentColor"/>
    <path id="l" d="M0,0 L66,0 C84.7776815,-3.44940413e-15 100,15.2223185 100,34 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" fill="currentColor"/>
    <path id="t" d="M0,0 L66,0 C84.7776815,-3.44940413e-15 100,15.2223185 100,34 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" transform="rotate(90 50 50)" fill="currentColor"/>
    <path id="lt" d="M0,0 L100,0 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" fill="currentColor"/>
    <path id="lb" d="M0,0 L100,0 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" transform="rotate(-90 50 50)" fill="currentColor"/>
    <path id="rb" d="M0,0 L100,0 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" transform="rotate(-180 50 50)" fill="currentColor"/>
    <path id="rt" d="M0,0 L100,0 L100,66 C100,84.7776815 84.7776815,100 66,100 L0,100 L0,0 Z" transform="rotate(90 50 50)" fill="currentColor"/>
    <path id="n_lt" d="M30.5,2V0H0v30.5h2C2,14.7,14.8,2,30.5,2z" fill="currentColor"/>
    <path id="n_lb" d="M2,69.5H0V100h30.5v-2C14.7,98,2,85.2,2,69.5z" fill="currentColor"/>
    <path id="n_rt" d="M98,30.5h2V0H69.5v2C85.3,2,98,14.8,98,30.5z" fill="currentColor"/>
    <path id="n_rb" d="M69.5,98v2H100V69.5h-2C98,85.3,85.2,98,69.5,98z" fill="currentColor"/>
    <path id="point" d="M600.001786,457.329333 L600.001786,242.658167 C600.001786,147.372368 587.039517,124.122784 581.464617,118.535383 C575.877216,112.960483 552.627632,99.9982143 457.329333,99.9982143 L242.670667,99.9982143 C147.372368,99.9982143 124.122784,112.960483 118.547883,118.535383 C112.972983,124.122784 99.9982143,147.372368 99.9982143,242.658167 L99.9982143,457.329333 C99.9982143,552.627632 112.972983,575.877216 118.547883,581.464617 C124.122784,587.027017 147.372368,600.001786 242.670667,600.001786 L457.329333,600.001786 C552.627632,600.001786 575.877216,587.027017 581.464617,581.464617 C587.039517,575.877216 600.001786,552.627632 600.001786,457.329333 Z M457.329333,0 C653.338333,0 700,46.6616668 700,242.658167 C700,438.667167 700,261.332833 700,457.329333 C700,653.338333 653.338333,700 457.329333,700 C261.332833,700 438.667167,700 242.670667,700 C46.6616668,700 0,653.338333 0,457.329333 C0,261.332833 0,352.118712 0,242.658167 C0,46.6616668 46.6616668,0 242.670667,0 C438.667167,0 261.332833,0 457.329333,0 Z M395.996667,200 C480.004166,200 500,220.008332 500,303.990835 C500,387.998334 500,312.001666 500,395.996667 C500,479.991668 480.004166,500 395.996667,500 C312.001666,500 387.998334,500 304.003333,500 C220.008332,500 200,479.991668 200,395.996667 C200,312.001666 200,350.906061 200,303.990835 C200,220.008332 220.008332,200 304.003333,200 C387.998334,200 312.001666,200 395.996667,200 Z" fill="currentColor"/>
    ${options.logo === 'fillstuff' ? logoSvg : ''}
    ${options.logo === 'image' && options.image ? imageSvg : ''}
  </defs>


  <g transform="translate(0,0)">
    ${qrModulesDataRender(data, size, moduleSize)}

    <use fill-rule="evenodd" transform="translate(0,0)" xlink:href="#point"/>
    <use fill-rule="evenodd" transform="translate(${size * moduleSize - 700},0)" xlink:href="#point"/>
    <use fill-rule="evenodd" transform="translate(0,${size * moduleSize - 700})" xlink:href="#point"/>

    ${options.logo === 'fillstuff' ? logoSvgMask : ''}
    ${options.logo === 'image' && options.image ? imageSvgMask : ''}
  </g>
</svg>
`;

	const svg = `
<svg viewBox="0 0 250 250" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <g id="qr" style="color: ${moduleColor}">${qrSvg}</g>
  </defs>
  <g clip-path="url(#main-mask)">
    <use x="0" y="0" xlink:href="#qr" transform="scale(1)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"/>
  </g>
</svg>
`;

	if (typeof cb === 'function') {
		cb(null, svg);
	}

	return svg;
};
