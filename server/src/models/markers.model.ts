import { Marker } from "./marker.model";

export class Markers {

	private markers: Record<string, Marker> = {};

	addMarker(marker: Marker) {
		this.markers[marker.getId()] = marker;
		return marker;
	}

	updateMarker(marker: Marker) {
		this.markers[marker.getId()] = marker;
	}

	getMarkers() {
		return this.markers;
	}

}