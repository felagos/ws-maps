import { useCallback, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import env from "../env";


const loader = new Loader({
	apiKey: env.MAP_API_KEY,
});

interface Position {
	lat: number;
	lng: number;
}

interface CreateMarker {
	id?: string;
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

export class Marker {

	constructor(
		public id: string,
		public lat: number,
		public lng: number
	) { }

	setPosition({ lat, lng }: Position) {
		this.lat = lat;
		this.lng = lng;
	}

}

export type Markers = Record<string, Marker>;

export const useMap = () => {

	const refMarkers = useRef<Markers>({});
	const refMap = useRef<google.maps.Map>();
	const refClickListener = useRef<google.maps.MapsEventListener>();

	const markerDragged$ = useRef(new Subject<Marker>());
	const newMarker$ = useRef(new Subject<Marker>());

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

	const createMarker = useCallback(async ({ lat, lng, title, id }: CreateMarker) => {
		const { Marker: MarkerGM } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

		const markerId = id ?? uuidv4();
		const marker = new MarkerGM({
			map: refMap.current,
			position: { lat, lng },
			title,
			draggable: true
		});

		marker.setValues({ id: markerId });

		return marker;

	}, []);

	const updateMarker = useCallback(async (id: string, lat: number, lng: number) => {
		const oldMarker = refMarkers.current[id];
			oldMarker.setPosition({ lat, lng });

			refMarkers.current[id] = oldMarker;

			markerDragged$.current.next(oldMarker);
	}, []);

	const addMarker = useCallback(async ({ id, lat, lng, title }: CreateMarker) => {
		const marker = await createMarker({ id, lat, lng, title });

		marker.addListener('dragend', (event: MapEvent) => {
			const { lat, lng } = event.latLng;

			updateMarker(marker.get('id'), lat(), lng());
		});

		const newMarker = new Marker(
			marker.get('id'),
			marker.getPosition()!.lat(),
			marker.getPosition()!.lng()
		);

		refMarkers.current[marker.get('id')] = newMarker;

		if (!id) newMarker$.current.next(newMarker);

	}, [createMarker, updateMarker]);

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

				refClickListener.current = map.addListener('click', async (event: MapEvent) => {
					const { lat, lng } = event.latLng;

					addMarker({ lat: lat(), lng: lng(), title: 'You are here now' });
				});
			});
		}


		return () => {
			refClickListener.current?.remove();

			refClickListener.current = undefined;
			refMap.current = undefined;
			refMarkers.current = {};
		}

	}, [addMarker, getCurrentPosition]);


	return {
		addMarker,
		updateMarker,
		markers: refMarkers.current,
		newMarker$: newMarker$.current,
		markerDragged$: markerDragged$.current
	};
};