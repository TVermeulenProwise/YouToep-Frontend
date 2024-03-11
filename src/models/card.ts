export enum CardType {
    Spades      = 0,
    Hearts      = 1,
    Diamonds    = 2,
    Clubs       = 3,
}

export enum CardValue {
    One     = 1,
    Two     = 2,
    Three   = 3,
    Four    = 4,
    Five    = 5,
    Six     = 6,
    Seven   = 7,
    Eight   = 8,
    Nine    = 9,
    Ten     = 10,
    Jack    = 11,
    Knight  = 12,
    Queen   = 13,
    King    = 14,
}

export interface Card {
    index: number;
    isPlayedInRound: number;
    type?: CardType;
    value?: CardValue;
}