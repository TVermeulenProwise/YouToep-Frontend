import { Button } from "@mui/material";
import { FC, useState } from "react";
import { PlayerInput } from "../components/playerInput";
import { ReactObject } from "../models/ReactObject";
import { SimpleGame } from "../models/SimpleGame";
import { ManualList } from "../components/manualList";
import { SimplePlayer } from "../models/SimplePlayer";
import { RemovePlayerDialog } from "../components/dialog/RemovePlayerDialog";
import { PromptDialog } from "../components/dialog/PromptDialog";

export const ListPage: FC = () => {
    const game = ReactObject.formState(new SimpleGame());

    const [activeDialog, activeDialogSetter] = useState<"" | "endRound" | "endGame">("");
    const [player, setPlayer] = useState<SimplePlayer | undefined>(undefined);

    const resetActiveDialog = () => {
        setPlayer(undefined);
        activeDialogSetter("");
    }

    game.eventEmitter = (event, player) => {
        activeDialogSetter(event);
        setPlayer({...player});
    }

    return (
    <>
        <PlayerInput
            knownPlayerNames={game.players.map(p => p.name)}
            onNewPlayer={game.addPlayerFromName.bind(game)}
        ></PlayerInput>
        <ManualList game={game}></ManualList>
        <PromptDialog
            title={`🎉 ${player?.name} won the round 🎉`}
            text={""}
            onClose={resetActiveDialog}
            open={activeDialog === "endRound"}></PromptDialog>
        <PromptDialog
            title={`👑 ${player?.name} is the winner 👑`}
            text={`${player?.name} won the game with only ${player?.points} points.`}
            onClose={resetActiveDialog}
            open={activeDialog === "endGame"}></PromptDialog>
    </>)
}
