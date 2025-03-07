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
        </div>
    )
}