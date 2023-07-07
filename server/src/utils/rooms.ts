import IRoomObjectList from '../types/IRoomObjectList';

export const roomExists = (roomId: string, rooms: IRoomObjectList) => {
	return rooms[roomId] != null;
};

export const isRoomJoined = (roomId: string, rooms: IRoomObjectList) => {
	return rooms[roomId]?.joinedBySocketId != null;
};

export const isUserACreatorOrJoinerOfRoom = (userSocketId: string, roomId: string, rooms: IRoomObjectList) => {
	return rooms[roomId]?.joinedBySocketId === userSocketId || rooms[roomId]?.createdBySocketId === userSocketId;
};
