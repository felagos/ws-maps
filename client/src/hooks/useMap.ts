import { useCallback, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { v4 as uuidv4 } from 'uuid';
import env from "../env";


const loader = new Loader({
	apiKey: env.MAP_API_KEY,
});

interface Position {
	lat: number;
	lng: number;
}

interface Marker {
	title: string;
	lat: number;
	lng: number;
}

interface ClickEvent {
	latLng: {
		lat: () => number;
		lng: () => number;
	}
}

type Markers = Record<string, google.maps.Marker>;

export const useMap = () => {

	const refMarkers = useRef<Markers>({});
	const refMap = useRef<google.maps.Map>();
	const refClickListener = useRef<google.maps.MapsEventListener>();

	const getCurrentPosition = useCallback(() => {
		return new Promise<Position>((resolve, reject) => {

			navigator.geolocation.getCurrentPosition(
				(position: GeolocationPosition) => {
					const pos: Position = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};

					resolve(pos);
				},
				(error) => {
					reject(error);
				}
			);

		})
	}, []);

	useEffect(() => {
		if (!refMap.current) {
			loader.importLibrary('maps').then(async () => {

				const { lat, lng } = await getCurrentPosition();

				const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

				const map = new Map(document.getElementById("map") as HTMLElement, {
					center: { lat, lng },
					zoom: 16,
					mapId: 'google-maps'
				});

				refMap.current = map;

				addMarker({ lat, lng, title: 'You are here' });

				refClickListener.current = map.addListener('click', async (event: ClickEvent) => {
					const { lat, lng } = event.latLng;

					const markerId = uuidv4();
					const marker = await addMarker({
						lat: lat(),
						lng: lng(),
						title: 'You are here now'
					});

					refMarkers.current[markerId] = marker;

				});
			});
		}


		return () => {
			refClickListener.current?.remove();

			refClickListener.current = undefined;
			refMap.current = undefined;
		}

	}, [getCurrentPosition]);

	const addMarker = async ({ lat, lng, title }: Marker) => {
		const { Marker } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

		return new Marker({
			map: refMap.current,
			position: { lat, lng },
			title,
		});

	}

	return { addMarker };
};