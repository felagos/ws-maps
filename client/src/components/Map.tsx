import { Map as GoogleMap } from '@vis.gl/react-google-maps';

export const Map = () => {

	return (
		<GoogleMap
			zoom={3}
			center={{ lat: 22.54992, lng: 0 }}
			gestureHandling={'greedy'}
			disableDefaultUI={true}
		/>
	);

}

