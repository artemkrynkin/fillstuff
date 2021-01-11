import { initDatabase } from './helper';

const IS_PROD = process.env.NODE_ENV === 'production';

export const dbAccount = initDatabase({
	dbUri: IS_PROD ? 'mongodb://artem:741310PTppl#@rc1c-r70mh0q5hyyvlo3i.mdb.yandexcloud.net:27018' : 'mongodb://localhost:27017',
	dbName: IS_PROD ? 'keeberink-account' : 'keeberink-account-local',
});

export const dbFillstuff = initDatabase({
	dbUri: IS_PROD ? 'mongodb://artem:741310PTppl#@rc1c-r70mh0q5hyyvlo3i.mdb.yandexcloud.net:27018' : 'mongodb://localhost:27017',
	dbName: IS_PROD ? 'keeberink-fillstuff' : 'keeberink-fillstuff-local',
});
