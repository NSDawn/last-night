import "../../App.css"
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";

export default function Menu() {

    const G = useGlobal();
    const [gameState, setGameState] = G.gameState;

    return (
        <main className={`menu ${gameState !== "menu" ? "disabled" : ""}`}>
            <h1>
                {t("menu.h1")}
            </h1>
            <h2>
                {t("menu.h2")}
            </h2>
            <button onClick={() => setGameState("comic")}>
                {t("menu.start")}
            </button>
        </main>
    )
}