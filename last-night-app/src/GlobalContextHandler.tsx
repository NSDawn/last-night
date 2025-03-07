import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { getDefaultMessageHistory, MessageHistory } from "./game/Messages";

const GlobalContext = createContext<GlobalSingleton>(null as unknown as GlobalSingleton);

function GlobalContextHandler(props: PropsWithChildren) {
    
    const currentApp = useState(null as null | string);
    const messageHistory = useState(getDefaultMessageHistory());
    const messageHistoryJSON = useState(JSON.stringify(getDefaultMessageHistory()));
    
    useEffect(() => {
        messageHistory[1](JSON.parse(messageHistoryJSON[0]));
    }, [messageHistoryJSON[0]])
    
    return (
        <GlobalContext.Provider value={{
            currentApp: currentApp,
            messageHistory: messageHistory,
            messageHistoryJSON: messageHistoryJSON,
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextHandler;

export type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type GlobalSingleton = {
    currentApp: State<null | string>;
    messageHistory: State<MessageHistory>;
    messageHistoryJSON: State<string>;
};

export function useGlobal() {
    return useContext(GlobalContext);
}