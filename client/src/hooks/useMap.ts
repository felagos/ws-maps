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

interface CreateMarker {
	title: string;
	lat: number;
	lng: number;
}

interface MapEvent {
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

	const createMarker = useCallback(async ({ lat, lng, title }: CreateMarker) => {
		const { Marker } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

		const markerId = uuidv4();
		const marker = new Marker({
			map: refMap.current,
			position: { lat, lng },
			title,
			draggable: true
		});

		marker.setValues({ id: markerId });

		return marker;

	}, []);

	const addMarker = useCallback( async ({ lat, lng, title }: CreateMarker) => {
		const marker = await createMarker({ lat, lng, title });

		marker.addListener('dragend', (event: MapEvent) => {
			const { lat, lng } = event.latLng;

			const oldMarker = refMarkers.current[marker.get('id')];
			oldMarker.setPosition({ lat: lat(), lng: lng() });

			refMarkers.current[marker.get('id')] = oldMarker;
		});

		refMarkers.current[marker.get('id')] = marker;
	}, [createMarker]);

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

				addMarker({ lat, lng, title: 'You are here' })

				refClickListener.current = map.addListener('click', async (event: MapEvent) => {
					const { lat, lng } = event.latLng;

					addMarker({ lat: lat(), lng: lng(), title: 'You are here now' });
				});
			});
		}


		return () => {
			refClickListener.current?.remove();

			Object.values(refMarkers.current).forEach(marker => {
				marker.setDraggable(null);
			});

			refClickListener.current = undefined;
			refMap.current = undefined;
			refMarkers.current = {};
		}

	}, [addMarker, getCurrentPosition]);


	return { addMarker: createMarker, markers: refMarkers.current };
};