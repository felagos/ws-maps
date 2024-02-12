import { useEffect } from "react";
import { Marker, Markers, useMap, useSocket } from "../hooks";
import { SocketEvents } from "../enum";

export const Map = () => {

	const { 
		newMarker$,
		markerDragged$,
		markers,
		addMarker
	} = useMap();
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
			socket.emit(SocketEvents.UPDATE_MARKER, {
				id: marker.id,
				lat: marker.lat,
				lng: marker.lng
			});
		})

		return () => {
			markerDragged$.unsubscribe();
		}

	}, [markerDragged$, socket]);

	useEffect(() => {
		socket.on(SocketEvents.NEW_MARKER, (marker: Marker) => {
			addMarker({
				id: marker.id,
				lat: marker.lat,
				lng: marker.lng,
				title: 'You are here now'
			})
		});
	}, [addMarker, socket]);

	useEffect(() => {
		socket.on(SocketEvents.ACTIVED_MARKERS, (markers: Markers) => {
			Object.values(markers).forEach((marker: Marker) => {
				addMarker({
					id: marker.id,
					lat: marker.lat,
					lng: marker.lng,
					title: 'You are here now'
				});
			});
			
		});
	}, [addMarker, socket]);

	return (
		<div id='map' />
	);

};