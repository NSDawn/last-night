import { GlobalSingleton } from "../GlobalContextHandler";

export function addFlag(flags: string[], flagId: string): string[] {
    if (!flags.includes(flagId)) {
        flags.push(flagId);
    }
    return flags;
}

export function removeFlag(flags: string[], flagId: string): string[] {
    let ind = flags.indexOf(flagId);
    if (ind !== -1) {
        flags.splice(ind, 1);
    }
    return flags;
}

export function toggleFlag(G: GlobalSingleton, flagId: string) {
    const [flags, setFlags] = G.flags;
    if (!flags.includes(flagId)) {
        setFlags([...flags, flagId]);
    } else {setFlags(flags.filter((flag) => flag !== flagId))};
}