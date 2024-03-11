import { SimplePlayer } from "./SimplePlayer";

export interface GameInterface<TPlayer extends SimplePlayer> {
    maxPoints: number;
    points: number;
    players: TPlayer[];
    lastKnockPlayerName: string;

    addPlayerFromName: (name: string) => void;
    removePlayer: (name: string) => void;

    knock: (player: TPlayer) => void;
    updateKnock: () => void;
    cancelKnock: () => void;
    inKnockState: () => boolean;

    winner: (player: TPlayer) => void;
    checkWinner: () => void;
}
