import { useEffect } from "react";
import { useMap, useSocket } from "../hooks";
import { SocketEvents } from "../enum";

export const Map = () => {

	const { newMarker$, markerDragged$, markers } = useMap();
	const { socket } = useSocket();

	useEffect(() => {
		newMarker$.subscribe((marker) => {
			socket.emit(SocketEvents.NEW_MARKER, marker);
		})

		return () => {
			newMarker$.unsubscribe();
		}
	}, [markers, newMarker$, socket]);

	useEffect(() => {
		markerDragged$.subscribe((marker) => {
		})

		return () => {
			markerDragged$.unsubscribe();
		}

	}, [markerDragged$]);

	return (
		<div id='map' />
	);

};