import React, { FC } from "react";
import { Room } from "../models/room";

export const RoomListItem: FC<{room: Room, onClick?: (room: Room) => void}> = (props) => {
    const onClick = () => {
        if (props.onClick !== undefined) props.onClick(props.room);
    }
    return <div className="roomListItem" key={props.room.name} onClick={onClick}>
        {props.room.name}
    </div>
}