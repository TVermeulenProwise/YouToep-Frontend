import { GameInterface } from "./GameInterface";
import { KnockStatus, SimplePlayer } from "./SimplePlayer";

type events = "endGame" | "endRound";

export class SimpleGame implements GameInterface<SimplePlayer> {
    public maxPoints = 10;
    public points = 1;
    public players: SimplePlayer[] = [];
    public lastKnockPlayerName = "";
    
    public constructor(public eventEmitter: (event: events) => void = () => {}) {}

    public inKnockState(): boolean {
        return this.players.some(p => 
            p.knockStatus == KnockStatus.InWait
            || p.knockStatus === KnockStatus.Continue
            || p.knockStatus === KnockStatus.Pass
        );
    };

    public addPlayerFromName(name: string) {
        if (!name) {
            return;
        }

        const points = this.players.length === 0
            ? 0
            : this.players.map(p => p.points).sort((p1, p2) => p2 - p1)[0];

        this.players.push({
            name,
            points,
            knockStatus: points === this.maxPoints
                ? KnockStatus.Out
                : this.inKnockState()
                    ? KnockStatus.InWait
                    : KnockStatus.None
        });
    };

    public removePlayer(name: string) {
        const response = confirm(`Are you sure you want to remove ${name}`);
        if (!response) {
            return;
        }

        const index = this.players.findIndex((p) => p.name === name);
        this.players.splice(index, 1);

        if (this.players.length === 0) {
            this.points = 1;
        }
        if (this.inKnockState()) {
            this.updateKnock();
        }
        if (this.lastKnockPlayerName === name) {
            this.lastKnockPlayerName = "";
        }
    }

    public knock(player: SimplePlayer) {
        if (this.inKnockState()) {
            throw new Error("You can't knock while another knock hasn't been resolved yet.");
        }

        this.players
            .filter((p) => p.knockStatus === KnockStatus.None)
            .forEach((p) => {
                p.knockStatus = (p.name === player.name || p.points + this.points >= 10)
                    ? KnockStatus.Continue
                    : KnockStatus.InWait;
            });
        
        this.lastKnockPlayerName = player.name;
        this.updateKnock();
    }

    public updateKnock() {
        if (!this.inKnockState() || this.players.some((p) => p.knockStatus === KnockStatus.InWait)) {
            return;
        }

        this.players.forEach((p) => {
            const status = p.knockStatus;

            if (status === KnockStatus.Pass) {
                p.points = Math.min(p.points + this.points, this.maxPoints);
                p.knockStatus = KnockStatus.Out;
            } else if (status === KnockStatus.Continue) {
                p.knockStatus = KnockStatus.None;
            }
        });

        this.points++;
        this.checkWinner();
    }

    public cancelKnock() {
        this.players.forEach((p) => {
            if (p.knockStatus === KnockStatus.InWait ||
                p.knockStatus === KnockStatus.Continue ||
                p.knockStatus === KnockStatus.Pass
            ) {
                p.knockStatus = KnockStatus.None;
            }
        });

        this.lastKnockPlayerName = "";
        if (this.points > 1) {
            this.points--;
        }
    }

    public winner(player: SimplePlayer) {
        if (this.inKnockState()) {
            return;
        }

        // Add points the losers.
        this.players
            .filter((p) =>
                p.knockStatus === KnockStatus.None &&
                p.name !== player.name
            )
            .forEach((p) => {
                p.points = Math.min(p.points + this.points, this.maxPoints);
            });
        
        // Reset States for a new round.
        this.players.forEach((p) => {
                p.knockStatus = p.points >= this.maxPoints
                    ? KnockStatus.Out
                    : KnockStatus.None;
            });
        this.points = 1;

        const remainingPlayers = this.players.filter((p) => p.points < this.maxPoints);
        if (remainingPlayers.length <= 1) {
            this.players.forEach((p) => {
                p.points = 0;
                p.knockStatus = KnockStatus.None;
            });

            this.eventEmitter?.("endGame");
            return;
        }

        this.eventEmitter?.("endRound");

        const max = this.players.map((p) => p.points)
            .filter((p) => p < this.maxPoints)
            .reduce((p1, p2) => Math.max(p1, p2));
        if (max === 9) {
            this.knock({} as unknown as SimplePlayer);
        }
    }

    public checkWinner() {
        if (this.players.length === 0 || this.inKnockState()) {
            return;
        }

        const playersRemaining = this.players
            .filter((p) => p.knockStatus === KnockStatus.None);

        if (playersRemaining.length === 1) {
            this.winner(playersRemaining[0]);
        }
    }
}
