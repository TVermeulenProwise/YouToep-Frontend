import { FC } from "react";
import { Button } from "@mui/material";
import { ReactObject } from "../models/ReactObject";

class PlayerInputState {
    public playerName = "";
    public isButtonActive = false;

    constructor(private readonly players: string[]) {}

    /**
     * Handle the update event of an input field that is used to fill in the player name.
     *
     * @param event Input change event.
     */
    public updatePlayerHandler: React.ChangeEventHandler = (event) => {
        this.updatePlayer((event.target as unknown as {value: string}).value);
    }

    /**
     * Update the name of the player.
     *
     * @param name The new version of the player name.
     */
    public updatePlayer(name: string) {
        this.isButtonActive = name !== undefined && name !== "" && !this.players.some(pName => pName === name)
        this.playerName = name;
    }

    /** Attempt to create and add a new player with player name. */
    public addPlayer(event: (playerName: string) => void) {
        if (!this.isButtonActive) {
            return;
        }

        event(this.playerName);
        this.playerName = "";
        this.isButtonActive = false;
    }
}

export const PlayerInput: FC<{
    knownPlayerNames: string[],
    onNewPlayer: (playerName: string) => void,
}> = (args) => {
    const state = ReactObject.formState(new PlayerInputState(args.knownPlayerNames));

    return <div>
        <input
            type="text"
            placeholder="player name"
            value={state.playerName}
            onChange={state.updatePlayerHandler}
            onKeyDown={(event) => {if (event.key === "Enter") state.addPlayer(args.onNewPlayer);}}
        ></input>
        <Button variant="contained" disabled={!state.isButtonActive} onClick={state.addPlayer.bind(state, args.onNewPlayer)}>Add Player</Button>
    </div>
}
