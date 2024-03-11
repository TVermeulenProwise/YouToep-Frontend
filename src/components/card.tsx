import { FC } from "react";
import { CardType, CardValue } from "../models/card";

const valueMap: Record<CardValue, string> = {
    [CardValue.One]: "1",
    [CardValue.Two]: "2",
    [CardValue.Three]: "3",
    [CardValue.Four]: "4",
    [CardValue.Five]: "5",
    [CardValue.Six]: "6",
    [CardValue.Seven]: "7",
    [CardValue.Eight]: "8",
    [CardValue.Nine]: "9",
    [CardValue.Ten]: "10",
    [CardValue.Jack]: "jack",
    [CardValue.Knight]: "knight",
    [CardValue.Queen]: "queen",
    [CardValue.King]: "king",
}

const typeMap: Record<CardType, string> = {
    [CardType.Spades]: "spades",
    [CardType.Hearts]: "hearts",
    [CardType.Diamonds]: "diamonds",
    [CardType.Clubs]: "clubs",
}

export const PlayingCard: FC<{ cardType?: CardType, cardValue?: CardValue }> = (props) => {
    return <>
        <img 
            src={props.cardType !== undefined && props.cardValue !== undefined
                ? `/images/${typeMap[props.cardType]}_${valueMap[props.cardValue]}.svg`
                :"/images/back_prowise.jpeg"
            }
            style={{
                width: "100%",
                height: "auto",
            }}>
        </img>
    </>
}