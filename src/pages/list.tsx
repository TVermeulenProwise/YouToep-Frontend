import { Button } from "@mui/material";
import { FC, useState } from "react";
import { PlayerInput } from "../components/playerInput";
import { ReactObject } from "../models/ReactObject";
import { SimpleGame } from "../models/SimpleGame";
import { ManualList } from "../components/manualList";
import { SimplePlayer } from "../models/SimplePlayer";

export const ListPage: FC = () => {
    const game = ReactObject.formState(new SimpleGame());

    game.eventEmitter = (event) => {
        game.players = game.players;
    }

    const [selectedUser, setSelectedUser] = useState(undefined as SimplePlayer | undefined);
    const [valueOfUser, setValueOfUser] = useState(undefined as number | undefined);

    const changeValue = (player: SimplePlayer) => {
        setValueOfUser(player.points);
        setSelectedUser(player);
    }
    const setChangedValue = () => {
        if (valueOfUser === undefined || !selectedUser) throw new Error();
        selectedUser.points = Number.isNaN(valueOfUser) ? 0 : valueOfUser;
        if (game.inKnockState() && game.lastKnockPlayerName === undefined) {
            game.cancelKnock();
        }
        const max = game.players.map(p => p.points).filter(p => p < game.maxPoints).reduce((p1, p2) => Math.max(p1, p2));
        if (max === (game.maxPoints - 1)) {
            game.knock({} as unknown as SimplePlayer);
        }
        setSelectedUser(undefined);
        setSelectedUser(undefined);
    }
    const cancelValueChange = () => {
        if (valueOfUser === undefined || !selectedUser) throw new Error();
        setSelectedUser(undefined);
        setValueOfUser(undefined);
    }

    return (
    <>
        <PlayerInput
            knownPlayerNames={game.players.map(p => p.name)}
            onNewPlayer={game.addPlayerFromName.bind(game)}
        ></PlayerInput>
        <ManualList game={game} tableClick={(player: SimplePlayer, column: string) => {
            if (column === "points") {
                changeValue(player);
            }
        }}></ManualList>
        { valueOfUser !== undefined && selectedUser !== undefined &&
            <div className="valueChanger">
                <div>
                    <input
                        type="number"
                        min={0}
                        max={game.maxPoints}
                        value={valueOfUser}
                        onChange={(event) => setValueOfUser(Math.max(0, Math.min(Number.parseInt(event.target.value), 10))) }
                        onKeyDown={(event) => {if (event.key === "Enter") setChangedValue();}}
                    />
                    <div className="verticalFlex">
                        <Button color="primary" variant="contained" onClick={setChangedValue}>Change</Button>
                        <Button color="primary" variant="outlined" onClick={cancelValueChange}>Cancel</Button>
                    </div>
                </div>
            </div>
        }
    </>)
}
