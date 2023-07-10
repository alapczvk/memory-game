import React, {createContext, useContext, useEffect, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import ISocketContext from '../types/ISocketContext';
import config from '../config';

const SocketContext = createContext<ISocketContext | null>(null);

export function useSocket(): ISocketContext | null {
	return useContext(SocketContext);
}

export function SocketProvider({children}: { children: React.ReactNode }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

	useEffect(() => {
		const newSocket = io(config.socketIoServerAddress, {
			autoConnect: true
		});

		const onConnect = () => {
			console.log('[socket.io] connected to server');
			setIsConnected(true);
			setReconnectAttempt(0);
		};
		const onDisconnect = () => {
			console.log('[socket.io] disconnected from server');
			setIsConnected(false);
		};
		const onError = (error: Error) => console.log(`[socket.io] error: ${error}`);
		const onConnectError = (error: Error) => {
			console.log(`[socket.io] connect error due to ${error.message}`);
		}
		const onReconnect = (attempt: number) => {
			setReconnectAttempt(0);
			setIsConnected(true);
			console.log(`[socket.io] reconnected on attempt: ${attempt}`);
		}
		const onReconnectAttempt = (attempt: number) => {
			setReconnectAttempt(attempt);
			console.log('[socket.io] reconnect attempt: ' + attempt);
		}
		const onReconnectError = (error: Error) => {
			console.log(`[socket.io] reconnect error: ${error}`);
		}
		const onReconnectFailed = () => console.log('[socket.io] reconnect failed');

		const onGreetingFromServer = (data: any) => console.log(`[socket.io] server sent welcome message: ${data?.msg}`);

		newSocket.on('connect', onConnect);
		newSocket.on('disconnect', onDisconnect);
		newSocket.on('error', onError);
		newSocket.on('connect_error', onConnectError);

		newSocket.io.on('error', onError);
		newSocket.io.on('reconnect', onReconnect);
		newSocket.io.on('reconnect_attempt', onReconnectAttempt);
		newSocket.io.on('reconnect_error', onReconnectError);
		newSocket.io.on('reconnect_failed', onReconnectFailed);

		newSocket.on('greeting-from-server', onGreetingFromServer);

		setSocket(newSocket);

		return () => {
			newSocket.off('connect', onConnect);
			newSocket.off('disconnect', onDisconnect);
			newSocket.off('error', onError);
			newSocket.off('connect_error', onConnectError);

			newSocket.io.off("error", onError);
			newSocket.io.off('reconnect', onReconnect);
			newSocket.io.off('reconnect_attempt', onReconnectAttempt);
			newSocket.io.off('reconnect_error', onReconnectError);
			newSocket.io.off('reconnect_failed', onReconnectFailed);

			newSocket.off('greeting-from-server', onGreetingFromServer);

			newSocket.close();
		}
	}, []);

	return <SocketContext.Provider value={{
		socket,
		isConnected,
		reconnectAttempt
	}}>
		{children}
	</SocketContext.Provider>;
}
