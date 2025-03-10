import { addChainMessageHistory, incrementShownMessagesMessageHistory } from "../../game/Messages";
import { addQuack } from "../../game/Quacks";
import { useGlobal } from "../../GlobalContextHandler";
import "./Debug.css";

export default function DebugTooltip() {

    const G = useGlobal();
    const [currentApp, _] = G.currentApp;
    const [notifStack, __] = G.notifStack;
    const [flags, ___] = G.flags;

    function addQuacks() {
        addQuack(G, [
            "update.0",
            "debugShrek.0",
            "debugShrek.1",
            "tim.0",
            "debugPlayer.0",
            "debugPlayer.1",
        ]); 
    }

    return (
        <div className="debug-tooltip">
            <h2>
                Current App: <code>{currentApp}</code>
            </h2>
            <h2>
                notifStack: <code>{`${notifStack.length}`}</code>
            </h2>
            <h2>
                flags: <code>{`${flags}`}</code>
            </h2>
            <button onClick={() => addChainMessageHistory(G, "debug.debugscene.1", "debugShrek")}>
                Add Chain 
            </button>
            
            <button onClick={() => incrementShownMessagesMessageHistory(G, 1, "debugShrek")}>
                (Shrek) Add Shown Messages + 1 
            </button>
            <br/>
            <button onClick={addQuacks}>
                Add Quacks
            </button>
        </div>
    )
}