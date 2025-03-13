import { useEffect } from "react";
import "../../App.css"
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";
import _imagesToPreload from "../../strings/filenames/imagesToPreload.json";
const imagesToPreload: string[] = _imagesToPreload;

export default function Menu() {

    const G = useGlobal();
    const [gameState, setGameState] = G.gameState;
    
    const preloadImages = (pathlist: string[]) => {
        pathlist.forEach((path) => {
          const img = new Image();
          img.src = path;
        });
    };

    useEffect(() => {
    preloadImages(imagesToPreload);
    }, []);

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