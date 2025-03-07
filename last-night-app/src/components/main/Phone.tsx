import { useGlobal } from "../../GlobalContextHandler"
import Screen from "./Screen";

export default function Phone() {
    
    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;

    return (
        <main className="phone">
            <div className="speaker" />
            <Screen />
            <div className="home-button">
                <button onClick={() => setCurrentApp(null)}/>

            </div>
        </main>
    )
}