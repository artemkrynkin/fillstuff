const debug = require('debug')('sockets');

import { joinStudio } from './studio';
import { newStoreNotification, editStoreNotification, deleteStoreNotification } from './storeNotifications';

const socket = io => {
	newStoreNotification(io);
	editStoreNotification(io);
	deleteStoreNotification(io);

	debug('Sockets running');

	io.on('connection', socket => {
		joinStudio(io, socket);

		socket.on('disconnect', reason => {});
	});
};

export default socket;
