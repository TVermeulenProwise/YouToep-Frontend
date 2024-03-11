import { useState } from "react"
import { ReactArray } from "./ReactArray";

export interface ReactModelOptions<T> {
    includeFunctions?: boolean;
    customFilter?: (key: keyof T, value: any) => boolean;
}

function defaultBehavior(obj: {}, key: string, value: unknown) {
    const [getValue, setValue] = useState(value);

    let currentValue = getValue;

    Object.defineProperty(
        obj,
        key,
        {
            get: () => currentValue,
            set: (v) => { setValue(v); currentValue = v; },
        },
    );
}

function arrayBehavior(obj: {}, key: string, value: Array<unknown>) {
    const [getValue, setValue] = useState(new ReactArray<unknown>(() => console.log("Event not set."), ...value));

    let currentValue = getValue;

    function updateHandler(arr: ReactArray<unknown>) {
        currentValue = new ReactArray<unknown>(updateHandler, ...arr);
        setValue(currentValue);
    }
    currentValue.event = updateHandler;

    Object.defineProperty(
        obj,
        key,
        {
            get: () => currentValue,
            set: (v) => {
                currentValue = new ReactArray<unknown>(updateHandler, ...v);
                setValue(currentValue);
            },
        },
    );
}

export namespace ReactObject {
    export function formState<T extends Object>(obj: T, options: ReactModelOptions<typeof obj> = {}): T {
        let entries = Object.entries(obj);
        
        if (!options.includeFunctions) {
            entries = entries.filter(([key, value]) => typeof value !== "function");
        }

        const customFilter = options.customFilter;
        if (customFilter && typeof customFilter === "function") {
            entries = entries.filter(([key, value]) => customFilter(key as keyof T, value));
        }

        entries.forEach(([key, value]) => {
            if (Array.isArray(value)) {
                arrayBehavior(obj, key, value);
            } else {
                defaultBehavior(obj, key ,value);
            }
        });

        return obj;
    }
}
