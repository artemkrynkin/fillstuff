export const specifications = ['color', 'diameter', 'marking', 'material', 'model', 'size', 'thickness', 'volume'];

export const specificationTransform = specification => {
	switch (specification) {
		case 'color':
			return 'Цвет';
		case 'diameter':
			return 'Диаметр';
		case 'marking':
			return 'Маркировка';
		case 'material':
			return 'Материал';
		case 'model':
			return 'Модель';
		case 'size':
			return 'Размер';
		case 'thickness':
			return 'Толщина';
		case 'volume':
			return 'Объем';
		default:
			return 'Unknown specification';
	}
};
