import { addChainMessageHistory, incrementShownMessagesMessageHistory } from "../../game/Messages";
import { addQuack } from "../../game/Quacks";
import { useGlobal } from "../../GlobalContextHandler";
import "./Debug.css";

export default function DebugTooltip() {

    const G = useGlobal();
    const [currentApp, _] = G.currentApp;
    const [gameState, setGameState] = G.gameState;
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
                flags: <code>{`${flags}`}</code>
            </h2>
            <button onClick={() => setGameState("comic")}>
                Comic
            </button>
            <button onClick={() => setGameState("game")}>
                Game
            </button>
        </div>
    )
}