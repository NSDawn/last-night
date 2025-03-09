export type Quack = {
    id: string,
    userId: string,
    timestamp: string,
    imgUrl?: string,
}

import _quackData from "../data/QuackData.json";
import { GlobalSingleton } from "../GlobalContextHandler";
const quackData: Record<string, Quack> = _quackData;

export function getQuack(quackId: string) {
    const DEFAULT_KEY = "debugShrek.0";
    return quackData[quackId] ?? quackData[DEFAULT_KEY];
}

export function addQuack(G: GlobalSingleton, quackId: string | string[]) {
    const [quacks, setQuacks] = G.quacks;
    if (typeof quackId === "string") {
        setQuacks([quackId, ...quacks]);
    } else {
        setQuacks([...quackId, ...quacks]);
    }
}
