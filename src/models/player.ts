import { Card } from "./card";

export enum PlayerKnockStatus {
    None = 0,
    Deciding = 1,
    Out = 3,
    ToContinue = 4,
    ToPass = 5,
}

export interface Player {
    name: string;
    points: number;
    hasLeft: boolean;
    cards?: Card[];
    knockStatus: PlayerKnockStatus;
}