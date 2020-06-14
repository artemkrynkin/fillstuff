export const joinStudio = (io, socket) => {
	socket.on('joinStudio', studioId => {
		socket.join(studioId);
	});
};
