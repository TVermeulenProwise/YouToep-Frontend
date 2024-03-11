import config from "../config.json";
import { Room } from "../models/room";
import { RoomRequest } from "../models/roomRequest";

export class RoomService {
    public static async getRooms(): Promise<Room[]> {
        const response = await fetch(config.backendUrl + "/room");
        const rooms = await response.json();
        return rooms;
    }
    public static async addRoom(name: string): Promise<boolean> {
        if (!name) return false;
        const response = await fetch(config.backendUrl + "/room/" + name, {
            method: "POST",
        });

        if (response.status !== 201) {
            alert(await response.text());
        }

        return response.status === 201;
    }

    public static async getRoom(roomName: string, playerName?: string): Promise<Room | undefined> {
        try {
            const response = await fetch(config.backendUrl + `/room/${roomName}${playerName ? "/" + playerName : ""}`);

            if (response.status !== 200) {
                return;
            }

            const room: Room = await response.json();
            return room;
        } catch (err) {
            return undefined;
        }
    }

    public static async joinAsPlayer(roomName: string, playerName: string): Promise<boolean> {
        const response = await fetch(config.backendUrl + `/room/${roomName}/play/join`, {
            method: "POST",
            body: JSON.stringify({ playerName } as RoomRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 200) {
            alert(await response.text());
        }

        return response.status === 200;
    }

    public static async leaveAsPlayer(roomName: string, playerName: string): Promise<boolean> {
        const response = await fetch(config.backendUrl + `/room/${roomName}/play/leave`, {
            method: "POST",
            body: JSON.stringify({ playerName } as RoomRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 200) {
            alert(await response.text());
        }

        return response.status === 200;
    }

    public static async startRound(roomName: string): Promise<void> {
        const response = await fetch(config.backendUrl + `/room/${roomName}/play/start`, {
            method: "POST"
        });

        if (response.status !== 200) {
            alert(await response.text());
        }
    }

    public static async playCard(roomName: string, playerName: string, cardIndex: number): Promise<boolean> {
        const response = await fetch(config.backendUrl + `/room/${roomName}/play/card`, {
            method: "POST",
            body: JSON.stringify({ playerName, cardIndex } as RoomRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 200) {
            alert(await response.text());
        }

        return response.status === 200;
    }

    public static async knock(roomName: string, playerName: string): Promise<boolean> {
        const response = await fetch(config.backendUrl + `/room/${roomName}/play/knock`, {
            method: "POST",
            body: JSON.stringify({ playerName } as RoomRequest),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            alert(await response.text());
        }

        return response.status === 200;
    }

    public static async knockEval(roomName: string, playerName: string, pass: boolean): Promise<boolean> {
        const response = await fetch(config.backendUrl + `/room/${roomName}/play/knock/eval`, {
            method: "POST",
            body: JSON.stringify({ playerName, pass } as RoomRequest),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            alert(await response.text());
        }

        return response.status === 200;
    }
}