import { Map } from "./component";
import { SocketProvider } from "./context";

export const App = () => {

	return (
		<SocketProvider>
			<Map />
		</SocketProvider>
	)

};

