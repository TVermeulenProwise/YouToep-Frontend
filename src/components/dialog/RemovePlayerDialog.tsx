import { FC } from "react";
import { GameInterface } from "../../models/GameInterface";
import { SimplePlayer } from "../../models/SimplePlayer";
import {
    Button, ButtonGroup,
    Dialog, DialogContent,
    DialogTitle,
} from "@mui/material";

export const RemovePlayerDialog: FC<{
    game: GameInterface<SimplePlayer>,
    onClose: () => void,
    playerName: string,
    open?: boolean,
}> = (args) => {

    return (
        <Dialog open={args.open ?? false} onClose={args.onClose} PaperProps={{style: { backgroundColor: "antiquewhite" }}}>
            <DialogTitle align={"center"}>Are you sure you want to remove "{args.playerName}"</DialogTitle>
            <DialogContent>
                <ButtonGroup fullWidth={true}>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={args.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color={"warning"}
                        variant={"outlined"}
                        onClick={() => {
                            args.game.removePlayer(args.playerName);
                            args.onClose();
                        }}
                    >
                        Remove
                    </Button>
                </ButtonGroup>
            </DialogContent>
        </Dialog>
    )
}
