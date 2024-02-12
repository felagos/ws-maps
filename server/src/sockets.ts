import { Server } from "socket.io";
import { SocketEvents } from "./enum";
import { Marker, Markers, NewMarker } from "./models";

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

			socket.on(SocketEvents.NEW_MARKER, (marker: NewMarker) => {
				const newMarker = new Marker(marker.id, marker.lat, marker.lng);
				this.markers.addMarker(newMarker);

				socket.broadcast.emit(SocketEvents.NEW_MARKER, newMarker);
			});

			socket.on(SocketEvents.UPDATE_MARKER, (marker: NewMarker) => {
				const newMarker = new Marker(marker.id, marker.lat, marker.lng);
				this.markers.updateMarker(newMarker);

				socket.broadcast.emit(SocketEvents.UPDATE_MARKER, newMarker);
			});

		});
	}
}
