import { useGlobal } from "../../GlobalContextHandler";
import "../../App.css";
import { useState } from "react";

export default function Comic() {

    const G = useGlobal();
    const [gameState, setGameState] = G.gameState;
    const [comic, setComic] = useState(0); 
    const [element, setElement] = useState(0); 
    const comics = [
        [
            <img className="comic-0-0" src="./assets/img/bg/comic0panel0.png" alt="" />,
            <img className="comic-0-1" src="./assets/img/bg/comic0panel1.png" alt="" />,
            <img className="comic-0-2" src="./assets/img/bg/comic0panel2.png" alt="" />,
        ]
    ]

    function onClickComic() {
        if (gameState !== "comic") return;
        console.log("yo")
        setElement(element + 1);
    }

    return (
        <main className={`comic ${gameState !== "comic" ? "disabled" : ""}`}>
            <div className="comic-wrapper" onClick={onClickComic}>
                {Array(element).fill("").map((_, i) => comics[comic][i])}
            </div>
        </main>
    )
}