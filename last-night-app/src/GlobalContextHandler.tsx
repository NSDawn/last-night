import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { getDefaultMessageHistory, getDefaultTopicInventory, MessageHistory, TopicInventory } from "./game/Messages";
import { t } from "./strings/i18n";
import { Notif } from "./components/elements/NotifHandler";
import { Config, getDefaultConfig } from "./game/Config";
import { getDefaultQuacks } from "./game/Quacks";

const GlobalContext = createContext<GlobalSingleton>(null as unknown as GlobalSingleton);

function GlobalContextHandler(props: PropsWithChildren) {
    
    const gameState = useState("menu" as string);
    const currentApp = useState(null as null | string);
    const messageHistory = useState(getDefaultMessageHistory());
    const messageHistoryJSON = useState(JSON.stringify(getDefaultMessageHistory()));
    const topicInventory = useState(getDefaultTopicInventory());
    const topicInventoryJSON = useState(JSON.stringify(getDefaultTopicInventory()));
    const flags = useState([] as string[]);
    const notes = useState([] as string[]);
    const quacks = useState(getDefaultQuacks() as string[]);
    const resolvedMessageChains = useState([] as string[]);
    const notifStack = useState([] as Notif[])
    const endGame = useState("");
    const config = useState(getDefaultConfig());
    const configJSON = useState(JSON.stringify(getDefaultConfig()))

    useEffect(() => {
        messageHistory[1](JSON.parse(messageHistoryJSON[0]));
    }, [messageHistoryJSON[0]]);

    useEffect(() => {
        config[1](JSON.parse(configJSON[0]));
    }, [configJSON[0]]);

    useEffect(() => {
        topicInventory[1](
            JSON.parse(topicInventoryJSON[0])
                .sort((a: string, b: string) => t(`topic.${a}`) > t(`topic.${b}`))
        );
    }, [topicInventoryJSON[0]]);

    return (
        <GlobalContext.Provider value={{
            gameState: gameState,
            notes: notes,
            flags: flags,
            quacks: quacks,
            currentApp: currentApp,
            messageHistory: messageHistory,
            messageHistoryJSON: messageHistoryJSON,
            topicInventory: topicInventory,
            topicInventoryJSON: topicInventoryJSON,
            resolvedMessageChains: resolvedMessageChains,
            notifStack: notifStack,
            endGame: endGame,
            config: config,
            configJSON: configJSON,
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextHandler;

export type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type GlobalSingleton = {
    gameState: State<string>;
    notes: State<string[]>;
    flags: State<string[]>;
    quacks: State<string[]>;
    currentApp: State<null | string>;
    messageHistory: State<MessageHistory>;
    messageHistoryJSON: State<string>;
    topicInventory: State<TopicInventory>;
    topicInventoryJSON: State<string>;
    resolvedMessageChains: State<string[]>;
    notifStack: State<Notif[]>;
    endGame: State<string>;
    config: State<Config>;
    configJSON: State<string>
};

export type SaveableGlobalSingleton = {
    gameState: string;
    notes: string[];
    flags: string[];
    quacks: string[];
    currentApp: null | string;
    messageHistoryJSON: string;
    topicInventoryJSON: string;
    resolvedMessageChains: string[];
    notifStack: Notif[];
    endGame: string;
    configJSON: string;
    timestamp?: number;
}

export function useGlobal() {
    return useContext(GlobalContext);
}

export function storeSaveData(data: SaveableGlobalSingleton, slot = 0) {
    localStorage.setItem(`wtts-save-${slot}`, JSON.stringify(data));
}

export function pullSaveData(slot = 0): SaveableGlobalSingleton | undefined {
    let s = localStorage.getItem(`wtts-save-${slot}`);
    if (s && s !== "") return JSON.parse(s);
    return undefined;
}

export function loadSaveData(G: GlobalSingleton, data: SaveableGlobalSingleton) {
    G.gameState[1](data.gameState);
    G.notes[1](data.notes);
    G.flags[1](data.flags);
    G.quacks[1](data.quacks);
    G.messageHistoryJSON[1](data.messageHistoryJSON);
    G.topicInventoryJSON[1](data.topicInventoryJSON);
    G.resolvedMessageChains[1](data.resolvedMessageChains);
    G.notifStack[1](data.notifStack);
    G.endGame[1](data.endGame);
    G.configJSON[1](data.configJSON);
}

export function makeSaveData(G: GlobalSingleton): SaveableGlobalSingleton {
    return {
        gameState: G.gameState[0],
        notes: G.notes[0],
        flags: G.flags[0],
        quacks: G.quacks[0],
        currentApp: G.currentApp[0],
        messageHistoryJSON: G.messageHistoryJSON[0],
        topicInventoryJSON: G.topicInventoryJSON[0],
        resolvedMessageChains: G.resolvedMessageChains[0],
        notifStack: G.notifStack[0],
        endGame: G.endGame[0],
        configJSON: G.configJSON[0],
        timestamp: Date.now()
    }
}

export function getEmptySaveData(): SaveableGlobalSingleton {
    return {
        gameState: "menu",
        notes: [],
        flags: [],
        quacks: getDefaultQuacks(),
        currentApp: null,
        messageHistoryJSON: JSON.stringify(getDefaultMessageHistory()),
        topicInventoryJSON: JSON.stringify(getDefaultTopicInventory()),
        resolvedMessageChains: [],
        notifStack: [],
        endGame: "",
        configJSON: JSON.stringify(getDefaultConfig()),
        timestamp: Date.now()
    }
}