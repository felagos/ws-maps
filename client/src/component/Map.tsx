import { useMap } from "../hooks";

export const Map = () => {

	useMap({ lat: -33.0470024, lng: -71.4419237 });

	return (
		<div id='map' />
	);

};