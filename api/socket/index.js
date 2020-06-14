import { sessionReload } from './auth';
import { joinStudio } from './studio';
import { createStoreNotification, editStoreNotification, deleteStoreNotification } from './storeNotifications';

const socket = io => {
	sessionReload(io);
	createStoreNotification(io);
	editStoreNotification(io);
	deleteStoreNotification(io);

	io.on('connection', socket => {
		joinStudio(io, socket);

		socket.on('disconnect', reason => {});
	});
};

export default socket;
