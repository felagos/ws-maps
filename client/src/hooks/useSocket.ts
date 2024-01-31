import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import env from "../env";
import { SocketEvents } from "../enum";

const connectSocket = (url: string) => {
	return io(url);
}

export const useSocket = (url: string = env.SOCKET_URL) => {
	const socket = useMemo(() => connectSocket(url), [url]);
	const [isOnline, setIsOnline] = useState(false);

	useEffect(() => {
		socket.on(SocketEvents.CONNECT, () => {
			setIsOnline(true);
		});

		socket.on(SocketEvents.DISCONNECT, () => {
			setIsOnline(false);
		});

		return () => {
			socket.disconnect();
		}

	}, [socket]);

	return {
		socket,
		isOnline
	}
}