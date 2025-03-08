import { addChainMessageHistory, incrementShownMessagesMessageHistory } from "../../game/Messages";
import { useGlobal } from "../../GlobalContextHandler";
import "./Debug.css";

export default function DebugTooltip() {

    const G = useGlobal();
    const [currentApp, _] = G.currentApp;

    return (
        <div className="debug-tooltip">
            <h2>
                Current App: <code>{currentApp}</code>
            </h2>
            <button onClick={() => addChainMessageHistory(G, "debug.debugscene.1", "debugShrek")}>
                Add Chain 
            </button>
            
            <button onClick={() => incrementShownMessagesMessageHistory(G, 1, "debugShrek")}>
                (Shrek) Add Shown Messages + 1 
            </button>
        </div>
    )
}