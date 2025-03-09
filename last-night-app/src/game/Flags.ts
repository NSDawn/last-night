import { GlobalSingleton } from "../GlobalContextHandler";

export function addFlag(G: GlobalSingleton, flagId: string) {
    const [flags, setFlags] = G.flags;
    if (!flags.includes(flagId)) {
        setFlags([...flags, flagId]);
    }
}

export function removeFlag(G: GlobalSingleton, flagId: string) {
    const [flags, setFlags] = G.flags;
    setFlags(flags.filter((flag) => flag !== flagId));
}

export function toggleFlag(G: GlobalSingleton, flagId: string) {
    const [flags, setFlags] = G.flags;
    if (!flags.includes(flagId)) {
        setFlags([...flags, flagId]);
    } else {setFlags(flags.filter((flag) => flag !== flagId))};
}