import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { getDefaultMessageHistory, getDefaultTopicInventory, MessageHistory, TopicInventory } from "./game/Messages";
import { t } from "./strings/i18n";

const GlobalContext = createContext<GlobalSingleton>(null as unknown as GlobalSingleton);

function GlobalContextHandler(props: PropsWithChildren) {
    
    const currentApp = useState(null as null | string);
    const messageHistory = useState(getDefaultMessageHistory());
    const messageHistoryJSON = useState(JSON.stringify(getDefaultMessageHistory()));
    const topicInventory = useState(getDefaultTopicInventory());
    const topicInventoryJSON = useState(JSON.stringify(getDefaultTopicInventory()));
    const flags = useState([] as string[])

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
            flags: flags,
            currentApp: currentApp,
            messageHistory: messageHistory,
            messageHistoryJSON: messageHistoryJSON,
            topicInventory: topicInventory,
            topicInventoryJSON: topicInventoryJSON,
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextHandler;

export type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type GlobalSingleton = {
    flags: State<string[]>;
    currentApp: State<null | string>;
    messageHistory: State<MessageHistory>;
    messageHistoryJSON: State<string>;
    topicInventory: State<TopicInventory>;
    topicInventoryJSON: State<string>;
};

export function useGlobal() {
    return useContext(GlobalContext);
}