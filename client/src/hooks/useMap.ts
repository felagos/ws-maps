import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import env from "../env";


const loader = new Loader({
	apiKey: env.MAP_API_KEY,
});

interface Params {
	lat: number;
	lng: number;
}

interface Marker {
	title: string;
	lat: number;
	lng: number;
}

export const useMap = ({ lat, lng }: Params) => {

	const refMap = useRef<google.maps.Map>();
	const refDragListener = useRef<google.maps.MapsEventListener>();

	useEffect(() => {
		if (!refMap.current) {
			loader.importLibrary('maps').then(async () => {

				const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

				const map = new Map(document.getElementById("map") as HTMLElement, {
					center: { lat, lng },
					zoom: 16,
					mapId: 'google-maps'
				});

				refMap.current = map;

				addMarker({ lat, lng, title: 'You are here' });

				refDragListener.current = map.addListener('dragend', () => {
					const { lat, lng } = map.getCenter()!;

					addMarker({
						lat: lat(),
						lng: lng(),
						title: 'You are here now'
					});
				});
			});
		}


		return () => {
			refDragListener.current?.remove();

			refDragListener.current = undefined;
			refMap.current = undefined;
		}

	}, [lat, lng]);

	const addMarker = async ({ lat, lng, title }: Marker) => {
		const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

		return new AdvancedMarkerElement({
			map: refMap.current,
			position: { lat, lng },
			title,
			gmpClickable: true,
		});

	}

	return { addMarker };
};