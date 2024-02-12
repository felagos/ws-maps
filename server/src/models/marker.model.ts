export class Marker {

	constructor(
		private id: string,
		private lng: number,
		private lat: number,
	) {}

	getId() {
		return this.id;
	}

	getLng() {
		return this.lng;
	}

	getLat() {
		return this.lat;
	}

}

export interface NewMarker {
	id: string;
	lat: number;
	lng: number;
}