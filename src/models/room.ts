import { Card } from "./card";
import { Player } from "./player";

export interface Room {
    name: string;
    players: Player[];
    round: number;
    inRound: boolean;
    currentPlayer?: Player;
    winner?: Player;
    isInKnockState: boolean;
    lastKnockPlayer?: Player;
    pointsForLoss: number;
    firstCardOfRound?: Card;
    settings: {
        maxPoints: number,
        maxPlayers: number,
    }
}