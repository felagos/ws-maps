import { Server } from "socket.io";
import { SocketEvents } from "./enum";
import { Marker, Markers } from "./models";

export class Sockets {

	private readonly io: Server;
	private markers = new Markers();

	constructor(io: Server) {
		this.io = io;

		this.socketEvents();
	}

	socketEvents() {
		this.io.on(SocketEvents.CONNECTION, (socket) => {

			socket.emit(SocketEvents.ACTIVED_MARKERS, this.markers.getMarkers());

			socket.on(SocketEvents.NEW_MARKER, (marker: Marker) => {
				console.log(marker);
				//this.markers.addMarker(marker);
			});

		});
	}
}
