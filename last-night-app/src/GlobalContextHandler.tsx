import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { getDefaultMessageHistory, getDefaultTopicInventory, MessageHistory, TopicInventory } from "./game/Messages";
import { t } from "./strings/i18n";
import { Notif } from "./components/elements/NotifHandler";

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
    const quacks = useState([] as string[]);
    const resolvedMessageChains = useState([] as string[]);
    const notifStack = useState([] as Notif[])
    const endGame = useState("");

    useEffect(() => {
        messageHistory[1](JSON.parse(messageHistoryJSON[0]));
    }, [messageHistoryJSON[0]])

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
};

export function useGlobal() {
    return useContext(GlobalContext);
}