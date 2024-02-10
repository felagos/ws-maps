import { useEffect } from "react";
import { useMap } from "../hooks";

export const Map = () => {

	const { newMarker$, markerDragged$ } = useMap();

	useEffect(() => {
		newMarker$.subscribe((marker) => {
		})
	}, [newMarker$]);

	useEffect(() => {
		markerDragged$.subscribe((marker) => {
		})
	}, [markerDragged$]);

	return (
		<div id='map' />
	);

};