import {Socket} from 'socket.io-client';

export default interface ISocketContext {
    socket: Socket | null,
    isConnected: boolean,
    reconnectAttempt: number
};
