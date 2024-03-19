import { FC, useState } from "react";
import { GameInterface } from "../../models/GameInterface";
import { KnockStatus, SimplePlayer } from "../../models/SimplePlayer";
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle } from "@mui/material";

export const UpdatePlayerPointsDialog: FC<{
    game: GameInterface<SimplePlayer>,
    onClose: () => void
    playerName: string,
    open?: boolean,
}> = (args) => {
    const player = args.game.players.find((p) => p.name === args.playerName);

    if (!player) {
        console.error(`No player found with name ${args.playerName}`);
        args.onClose();
        return;
    }

    const [points, setPoints] = useState(player.points)

    const setChangedValue = () => {
        const prevPoints = player.points;
        const prevState = player.knockStatus;

        // Update point total
        player.points = points ?? 0;

        // Update player state
        if (prevState !== KnockStatus.Out
            || (prevState === KnockStatus.Out && prevPoints >= args.game.maxPoints)
        ) {
            player.knockStatus = args.game.inKnockState()
                ? KnockStatus.InWait
                : KnockStatus.None;
        }

        if (player.points >= args.game.maxPoints) {
            player.knockStatus = KnockStatus.Out;
            args.game.checkWinner();
        }

        if (args.game.lastKnockPlayerName === undefined
            && args.game.points === 1
            && prevPoints === (args.game.maxPoints - 1)
        ) {
            args.game.cancelKnock();
            args.game.checkPoverty();
        }

        args.game.players = args.game.players;
        args.onClose();
    }

    return (
        <Dialog open={args.open ?? false} onClose={args.onClose} PaperProps={{style: {backgroundColor: "antiquewhite"}}}>
            <DialogTitle align={"center"}>Update point total of {args.playerName}</DialogTitle>
            <DialogContent>
                <input
                    type="number"
                    min={0}
                    max={args.game.maxPoints}
                    value={points}
                    style={{
                        width: "100%",
                        marginBottom: ""
                    }}
                    autoFocus={true}
                    onChange={(event) => {
                        setPoints(Math.max(0, Math.min(Number.parseInt(event.target.value), args.game.maxPoints)));
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            setChangedValue();
                        }
                    }}
                />
                <center>
                    <ButtonGroup>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={args.onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="warning"
                            variant="outlined"
                            onClick={args.onClose}
                        >
                            Update
                        </Button>
                    </ButtonGroup>
                </center>
            </DialogContent>
        </Dialog>
    )
}
