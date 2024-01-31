import { APIProvider } from '@vis.gl/react-google-maps';
import { SocketProvider } from "./context";
import env from "./env";
import { Map } from './components';

export const App = () => (
	<SocketProvider>
		<APIProvider apiKey={env.MAP_API_KEY}>
			<Map />
		</APIProvider>
	</SocketProvider>
);