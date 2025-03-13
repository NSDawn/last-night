import { useGlobal } from "../../GlobalContextHandler"
import AudioManager from "../elements/AudioManager";
import Screen from "./Screen";

export default function Phone() {
    
    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    const [gameState, setGameState] = G.gameState;

    return (
        <main className={`phone ${gameState !== "game" ? "disabled": ""}`}>
            <div className="speaker" />
            <Screen />
            <div className="home-button">
                <button onClick={() => setCurrentApp(null)}/>
                
            </div>
            <AudioManager />
        </main>
    )
}