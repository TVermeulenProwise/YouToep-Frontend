import React, { FC, useEffect, useState } from "react";
import { RoomService } from "../services/RoomService";
import { Room } from "../models/room";
import { RoomListItem } from "../components/roomListItem";
import { Button } from "@mui/material";

export const HomePage: FC = () => {
    const [rooms, setRooms] = useState([] as Room[]);
    const [roomName, setRoomName] = useState("");
    const [isButtonActive, setIsButtonActive] = useState(false);

    const redirectToRoom = (room: Room) => {
        location.href = "/room/" + room.name;
    }
    const inputEventHandler: React.ChangeEventHandler = (event) => {
        const value = (event.target as unknown as {value: string}).value;
        setIsButtonActive(value !== undefined && value !== "" && !rooms.some(r => r.name === value));
        setRoomName(value);
    }
    const createEventHandler = () => {
        if (!isButtonActive) return;
        RoomService.addRoom(roomName)
            .then(res => {
                if (res) redirectToRoom({name: roomName} as unknown as Room);
            })
            .catch(() => {
                console.log("Unable to create a room without server connection.");
            });
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const r = await RoomService.getRooms();
                setRooms(r);
            } catch (err) { }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    });
    

    return (
        <>
            <Button color="primary" variant="contained" onClick={() => location.href = "/list"}>Play list</Button>
            <div className="form verticalFlex">
                <div>
                    <h3>Create a new toep-room</h3>
                    <input
                        type="text"
                        placeholder="Room name"
                        className="fullWidth"
                        value={roomName}
                        onChange={inputEventHandler}
                        onKeyDown={(event => {if (event.key === "Enter") createEventHandler()})}/>
                </div>
                <Button className="createButton" color="primary" variant="contained" disabled={!isButtonActive} onClick={createEventHandler}>
                    Create
                </Button>
            </div>
            <div className="roomList">
                {rooms.map(room => <RoomListItem room={room} onClick={redirectToRoom}/>)}
            </div>
        </>
    );
}