import { sessionStore } from 'shared/middlewares/session';

import Emitter from 'api/utils/emitter';

export const sessionReload = io => {
	Emitter.on('session:reload', sid => {
		Object.keys(io.sockets.connected).forEach(async client => {
			if (io.sockets.sockets[client].handshake.session.id !== sid) return;

			const session = await sessionStore.get(sid, (err, session) => {
				if (err) return null;

				session.id = sid;
			});

			if (!session) {
				io.to(client).emit('logout');
				io.sockets.sockets[client].client.disconnect();
				return;
			}

			io.sockets.sockets[client].handshake.session = session;
		});
	});
};
