import { FC } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { KnockStatus, SimplePlayer } from "../models/SimplePlayer";
import { GameInterface } from "../models/GameInterface";

export const ManualList: FC<{
    game: GameInterface<SimplePlayer>,
    tableClick: (player: SimplePlayer, column: string) => void
}> = (args) => {
    const { game } = args;

    const getColor = (player: SimplePlayer): string | undefined => {
        if (player.points === game.maxPoints) return "gray";
        let localPoints = player.points;
        if (player.knockStatus !== KnockStatus.Out) {
            localPoints += game.points;
        }

        if (localPoints === 9) {
            return "rgb(245, 182, 88)";
        } else if (localPoints >= 10) {
            return "rgb(245, 119, 88)";
        }

        return undefined;
    }

    return <>
    <span>Points on loss/pass: {game.points}</span>
    <div className="tableDiv">
        <TableContainer>
            <Table sx={{scrollBehavior: "auto"}}>
                <TableBody>
                    {game.players.map((p) => (
                        <TableRow key={`${p.name}-manual-list-row`} style={{
                            backgroundColor: getColor(p),
                        }}>
                            <TableCell onClick={() => args.tableClick(p, "name")}>
                                {p.name}
                            </TableCell>
                            <TableCell onClick={() => args.tableClick(p, "points")}>
                                {p.points}/{game.maxPoints}
                            </TableCell>
                            {!game.inKnockState() && <>
                                <TableCell>
                                    <Button
                                    variant="contained"
                                    disabled={
                                        p.points + game.points >= game.maxPoints
                                        || p.knockStatus === KnockStatus.Out
                                        || game.players.length === 1
                                        || p.name === game.lastKnockPlayerName
                                    }
                                    onClick={() => game.knock(p)}>
                                        Knock
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                    variant="contained"
                                    color="success"
                                    disabled={
                                        p.knockStatus !== KnockStatus.None
                                        || game.players.length === 1
                                    }
                                    onClick={() => game.winner(p)}>
                                        Winner
                                    </Button>
                                </TableCell>
                            </>}
                            {game.inKnockState() && <>
                                {p.knockStatus === KnockStatus.InWait && <>
                                    <TableCell>
                                        <Button
                                        variant="contained"
                                        onClick={() => {
                                            p.knockStatus = KnockStatus.Continue;
                                            game.updateKnock();
                                            game.players = game.players;
                                        }}>
                                            Continue
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            p.knockStatus = KnockStatus.Pass;
                                            game.updateKnock();
                                            game.players = game.players;
                                        }}>
                                            Pass
                                        </Button>
                                    </TableCell>
                                </>}
                                {p.knockStatus !== KnockStatus.InWait && <>
                                    <TableCell colSpan={2}>
                                        {(p.knockStatus === KnockStatus.Continue
                                            || p.knockStatus === KnockStatus.Pass)
                                            && p.name !== game.lastKnockPlayerName
                                            && p.points + game.points < 10 &&
                                        <Button
                                        variant="outlined"
                                        style={{width: "100%"}}
                                        onClick={() => {
                                            p.knockStatus = KnockStatus.InWait;
                                            game.updateKnock();
                                            game.players = game.players;
                                        }}>
                                            Cancel {p.knockStatus === KnockStatus.Continue ? "continue" : "pass"}
                                        </Button>}
                                    </TableCell>
                                </>}
                            </>}
                            <TableCell>
                                <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => game.removePlayer(p.name)}>
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    </>
}
