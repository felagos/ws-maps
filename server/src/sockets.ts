import { Server } from "socket.io";
import { SocketEvents } from "./enum";
import { Markers } from "./models";

export class Sockets {

	private readonly io: Server;
	private markers = new Markers();

	constructor(io: Server) {
		this.io = io;

		this.socketEvents();
	}

	socketEvents() {
		this.io.on(SocketEvents.CONNECTION, (socket) => {
			console.log('Client connected');			
		});
	}
}
