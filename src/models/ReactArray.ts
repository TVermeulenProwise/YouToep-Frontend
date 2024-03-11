
export type UpdateEventHandler<T> = (arr: ReactArray<T>) => void;

export class ReactArray<T> extends Array<T> {
    public constructor(event: UpdateEventHandler<T>, arrayLength?: number)
    public constructor(event: UpdateEventHandler<T>, ...items: T[])
    public constructor(public event: UpdateEventHandler<T>, ...args: any) {
        super(...args);
    }

    public push(...items: T[]): number {
        const result = super.push(...items);
        this.event(this);
        return result;
    }

    public pop(): T | undefined {
        const result = super.pop();
        this.event(this);
        return result;
    }

    public shift(): T | undefined {
        const result = super.shift();
        this.event(this);
        return result;
    }

    public unshift(...items: T[]): number {
        const result = super.unshift();
        this.event(this);
        return result;
    }

    public splice(start: number, deleteCount?: number | undefined): T[];
    public splice(start: number, deleteCount: number, ...items: T[]): T[];
    // @ts-expect-error Reasons.
    public splice(start: number, deleteCount?: number, ...rest?: T[]): T[] {
        // @ts-expect-error Reasons.
        const result = super.splice(start, deleteCount, ...rest);
        this.event(this);
        return result;
    }

    public fill(value: T, start?: number | undefined, end?: number | undefined): this {
        const result = super.fill(value, start, end);
        this.event(this);
        return result;
    }

    public copyWithin(target: number, start: number, end?: number | undefined): this {
        const result = super.copyWithin(target, start, end);
        this.event(this);
        return result;
    }
}
