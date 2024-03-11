
export enum KnockStatus {
    None,
    InWait,
    Continue,
    Pass,
    Out,
}

export interface SimplePlayer {
    name: string;
    points: number;
    knockStatus: KnockStatus;
}
