import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Room } from "../models/room";
import { RoomService } from "../services/RoomService";
import { Error404 } from "./404";
import { Player, PlayerKnockStatus } from "../models/player";
import { Card } from "../models/card";
import { PlayingCard } from "../components/card";
import { Button } from "@mui/material";

export const RoomPage: FC = () => {
    const { roomName } = useParams();

    if (!roomName) {
        return Error404({});
    }

    const [notification] = useState(new Audio("/sounds/notification.wav"))
    const [room, setRoom] = useState({} as Room | undefined);
    const [playerName, setPlayerName] = useState(sessionStorage.getItem(roomName) as string | undefined);
    const [canJoin, setCanJoin] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [promptBox, setPromptBox] = useState<JSX.Element | undefined>(undefined);
    const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
    const [inputState, setInputState] = useState(false);
    const [lastCurrentPlayerName, setLastCurrentPlayerName] = useState("");

    const updatePlayerName: React.ChangeEventHandler = (event) => {
        const value = (event.target as unknown as { value: string }).value;
        setPlayerName(value);
        setCanJoin(value !== undefined && value !== "" && !room?.players.map(p => p.name).includes(value));
    }
    const joinGame = () => {
        if (!playerName || !canJoin) {
            return;
        }

        RoomService.joinAsPlayer(roomName, playerName)
        .then(response => {
            if (response) {
                console.log("Joined as player: " + playerName);
                setInGame(true);
                sessionStorage.setItem(roomName, playerName);
            }
        });
    }
    const leaveGame = () => {
        setPromptBox(<>
            <h4 style={{ display: "block", width: "auto"}}>Are you sure?</h4>
            <div className="verticalFlex">
                <Button color="primary" variant="contained" onClick={() =>
                    {
                        setPromptBox(undefined);
                    }}>No</Button>
                <Button color="primary" variant="outlined" onClick={() =>
                    {
                        RoomService.leaveAsPlayer(roomName, playerName ?? "")
                            .then((response) => {
                                if (response) {
                                    setPromptBox(undefined);
                                    setPlayerName(undefined);
                                    setInGame(false);
                                    sessionStorage.clear();
                                }
                            });
                    }}>Yes</Button>
            </div>
        </>);
    }
    const startGame: React.MouseEventHandler = () => {
        console.log("Start round.");
        RoomService.startRound(roomName);
    }
    const playCard = () => {
        if (selectedCard === undefined || playerName === undefined) {
            return;
        }
        RoomService.playCard(roomName, playerName, selectedCard.index)
            .then((response) => {
                if (response) {
                    setInputState(false);
                }
            });
    }
    const knock = () => {
        if (playerName === undefined) {
            return;
        }
        RoomService.knock(roomName, playerName);
    }
    const respondToKnock = (pass: boolean) => {
        if (playerName === undefined) {
            return;
        }
        RoomService.knockEval(roomName, playerName, pass);
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            const r = await RoomService.getRoom(roomName, inGame ? playerName : undefined)
            if (!r) {
                console.log("Unable to fetch room " + roomName);
                location.href = "/";
            } else {
                setRoom(r);
                const name = room?.inRound ? r.currentPlayer?.name ?? "" : "";
                if (inGame && name !== lastCurrentPlayerName && name === playerName) {
                    notification.play();
                }
                setLastCurrentPlayerName(name);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    });

    const getColor = (player: Player): string | undefined => {
        if (player.points === room?.settings?.maxPoints) return "gray";
        let localPoints = player.points;
        if (player.knockStatus !== PlayerKnockStatus.Out) {
            localPoints += room?.pointsForLoss ?? 1;
        }
        
        if (localPoints === 9) {
            return "rgb(245, 182, 88)";
        } else if (localPoints >= 10) {
            return "rgb(245, 119, 88)";
        }

        return undefined;
    }

    const realMod = (value: number, mod: number): number => {
        const result = value % mod;
        if (result < 0) {
            return Math.abs(mod) + result;
        }
        return result;
    }

    return (
        <>
            <h2 style={{margin: 0}}>{roomName}</h2>
            { !inGame && <div className="form verticalFlex">
                <input
                    type="text"
                    placeholder="Your player name."
                    onChange={updatePlayerName}
                    onKeyDown={(event) => {if (event.key === "Enter") joinGame();}}
                />
                <Button color="primary" variant="contained" disabled={!canJoin} onClick={joinGame}>Join</Button>
            </div> }
            { inGame && <div>
                <Button color="primary" variant="contained" disabled={room?.inRound || ((room?.players.length ?? 2) < 2)} onClick={startGame}>Start Round</Button>
                <Button color="warning" variant="contained" onClick={leaveGame}>Leave</Button>
            </div>}
            
            <div className="tableDiv">
                <table>
                    <tbody>
                        {room && room.players?.map((p, i) => 
                        <tr key={i} style={{
                            backgroundColor: getColor(p),
                        }}>
                            <td>{ p.name }</td>
                            <td>{ `${p.points}/${room.settings?.maxPoints}` }</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div className="tableDiv">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Points</th>
                            <th>R1</th>
                            <th>R2</th>
                            <th>R3</th>
                            <th>R4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {room?.players?.map((p, i) => <>
                            <tr key={i}>
                                <td>
                                    {p.name} {p.name === room.winner?.name ? "👑" : ""} <span>{p.name === room.currentPlayer?.name ? "•" : ""}</span>
                                </td>
                                <td>{ `${p.points}/${room.settings.maxPoints}` }</td>
                                {(p.cards?.sort((c1, c2) => realMod(c1.isPlayedInRound - 1, 100) - realMod(c2.isPlayedInRound - 1, 100)) ?? [])
                                    .map(c => <td>
                                    <div className="card">
                                        <PlayingCard cardType={c?.type} cardValue={c?.value}></PlayingCard>
                                    </div>    
                                </td>)}
                            </tr>
                        </>)}
                    </tbody>
                    
                </table>
            </div>

            { playerName !== undefined && room?.players?.some((p) => p.name === playerName) && <div className="openHand" onClick={() => setInputState(true)}>
                <span>✋</span>
                { room.currentPlayer?.name == playerName && <div></div>}
            </div>}

            { (inputState || room?.isInKnockState) && <div className="valueChanger" onClick={() => setInputState(false)}>
                <div onClick={(event) => event.stopPropagation()}>
                    <div className="close" onClick={() => setInputState(false)}>
                    ✕
                    </div>
                    { !room?.isInKnockState && room?.inRound && <><div className="cardList">
                        {<div className="points">
                            { `${room?.players.find(p => p.name === playerName)?.points ?? 0}/${room.settings?.maxPoints}` }
                        </div>}
                        {room?.players.find(p => p.name === playerName)
                            ?.cards
                            ?.filter(c => c.isPlayedInRound === 0)
                            .map((c, i, arr) => <div className="card" onClick={() => {
                                if (c === selectedCard) {
                                    setSelectedCard(undefined);
                                } else {
                                    setSelectedCard(c)
                                }
                            }}>
                                <PlayingCard cardType={c.type} cardValue={c.value}></PlayingCard>
                                {selectedCard?.index !== c.index && <div></div>}
                                { room.firstCardOfRound !== undefined && c.type !== room.firstCardOfRound.type && arr.some(card => card.type === room.firstCardOfRound?.type) && 
                                    <div style={{ border: "2px solid red" }}></div>
                                }
                            </div>)
                        }
                        </div>
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ width: "100%" }}
                            onClick={playCard}
                            disabled={selectedCard === undefined || room?.currentPlayer?.name !== playerName}>
                                Play card
                        </Button>
                        <hr/>
                        <Button color="primary" variant="contained" onClick={knock}>Knock</Button>
                    </>}
                    { room?.isInKnockState && room.players.find((p) => p.name === playerName)?.knockStatus === PlayerKnockStatus.Deciding && <>
                        <h4>{room.lastKnockPlayer?.name} knocked</h4>
                        <Button color="primary" variant="contained" onClick={() => respondToKnock(false)}>Continue</Button>
                        <Button color="primary" variant="contained" onClick={() => respondToKnock(true)}>Pass</Button>
                    </>}
                    { room?.isInKnockState && room.players.find((p) => p.name === playerName)?.knockStatus !== PlayerKnockStatus.Deciding && <>
                        <h4>Waiting on other players.</h4>
                    </>}
                </div>
            </div>}

            { promptBox !== undefined && <div className="valueChanger">
                <div>
                    {promptBox}
                </div>
            </div> }
        </>
    );
}