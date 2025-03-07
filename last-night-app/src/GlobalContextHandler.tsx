import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext<GlobalSingleton>(null as unknown as GlobalSingleton);

function GlobalContextHandler(props: PropsWithChildren) {
    
    const currentApp = useState(null as null | string);
    
    
    return (
        <GlobalContext.Provider value={{
            currentApp: currentApp
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
export default GlobalContextHandler;

export type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type GlobalSingleton = {
    currentApp: State<null | string>;
};

export function useGlobal() {
    return useContext(GlobalContext);
}