const removeFinderPattern = matrix => {
	let size = matrix.size;
	let pos = [
		// top-left
		[0, 0],
		// top-right
		[size - 7, 0],
		// center
		[(size - 7 * 3) / 2 + 7, (size - 7 * 3) / 2 + 7],
		// bottom-left
		[0, size - 7],
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

export default (qrData, customOptions, cb) => {
	const options = {
		color: 'colored',
		...customOptions,
	};

	removeFinderPattern(qrData.modules);

	const data = qrData.modules.data;
	const size = qrData.modules.size;
	const moduleSize = 97;
	const moduleColor = options.color === 'colored' ? '#2B3544' : '#000000';
	const logoModule1Color = options.color === 'colored' ? '#00BFA5' : '#ffffff';
	const logoModule2Color = options.color === 'colored' ? '#FFC74A' : '#ffffff';
	const logoModule3Color = options.color === 'colored' ? '#DD5B5B' : '#ffffff';

	const qrSvg = `
<svg style="color: ${moduleColor}" viewBox="0 0 ${moduleSize * size} ${moduleSize *
		size}" width="250px" height="250px" version="1.1" class="qr-code" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
    <g id="blikside_logo" stroke="none" stroke-width="1" fill="none">
      <rect fill="currentColor" x="0" y="0" width="${moduleSize * 7}" height="${moduleSize * 7}" rx="150"/>
      <g transform="translate(90, 90) scale(15)">
        <path fill="${logoModule1Color}" d="M20,33 C12.8690768,33 7,27.1466679 7,19.9527897 L7,3.70815451 C7,1.66892873 8.65361991,0 10.675,0 C12.6963801,0 14.3507854,1.66892873 14.3507854,3.70815451 L14.3507854,19.9527897 C14.3507854,23.0743896 16.9057178,25.583691 20,25.583691 C23.0942821,25.583691 25.6492147,23.0743896 25.6492147,19.9527897 L25.6492147,15.2832618 C25.6492147,13.244036 27.3036199,11.5751073 29.325,11.5751073 C31.3463802,11.5751073 33,13.244036 33,15.2832618 L33,19.9527897 C33,27.1466679 27.1309231,33 20,33 Z"/>
        <path fill="${logoModule2Color}" d="M20.005,5.55 C17.9753186,5.55 16.33,7.22885754 16.33,9.29991292 L16.33,19.8000871 C16.33,21.8711424 17.9753186,23.55 20.005,23.55 C22.0346815,23.55 23.68,21.8711424 23.68,19.8000871 L23.68,9.29991292 C23.68,7.22885754 22.0346815,5.55 20.005,5.55 Z"/>
        <circle fill="${logoModule3Color}" cx="3.5" cy="29.5" r="3.5"/>
      </g>
    </g>
    <clipPath id="logo-mask">
      <rect x="0" y="0" width="750" height="750"/>
    </clipPath>
  </defs>


  <g transform="translate(0,0)">
    ${qrModulesDataRender(data, size, moduleSize)}

    <use fill-rule="evenodd" transform="translate(0,0)" xlink:href="#point"/>
    <use fill-rule="evenodd" transform="translate(${size * moduleSize - 700},0)" xlink:href="#point"/>
    <use fill-rule="evenodd" transform="translate(0,${size * moduleSize - 700})" xlink:href="#point"/>

    <use fill="none" fill-rule="evenodd" transform="translate(${((size - 7 * 3) / 2 + 7) * moduleSize}, ${((size - 7 * 3) / 2 + 7) *
		moduleSize})" xlink:href="#blikside_logo"/>
  </g>
</svg>
`;

	const svg = `
<svg viewBox="0 0 250 250" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <g id="qr">${qrSvg}</g>
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
