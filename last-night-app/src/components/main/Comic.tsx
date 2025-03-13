import { useGlobal } from "../../GlobalContextHandler";
import "../../App.css";
import { useEffect, useState } from "react";
import "./Comic.css";
import { t } from "../../strings/i18n";
import { playAudio } from "../../game/AudioManager";

export default function Comic() {

    const G = useGlobal();
    const [gameState, setGameState] = G.gameState;
    const [endGame, _] = G.endGame;
    const [comic, setComic] = useState(0); 
    const [element, setElement] = useState(1); 
    const comics = [
        [
            <img className="comic-0-0" src="./assets/img/bg/comic0panel0.png" alt="" />,
            <div className="comic-0-0-1 bubble"><div className="text-wrapper">{t(`comic.0.0`)}</div></div>,
            <img className="comic-0-1" src="./assets/img/bg/comic0panel1.png" alt="" />,
            <div className="comic-0-0-2 bubble"><div className="text-wrapper">{t(`comic.0.1`)}</div></div>,
            <img className="comic-0-2" src="./assets/img/bg/comic0panel2.png" alt="" />,
            <div className="comic-0-2-0 bubble"><div className="text-wrapper">{t(`comic.0.2`)}</div></div>,
        ],
        [
            <img className="comic-1-0" src="./assets/img/bg/comic1panel0.png" alt="" />,
            <img className="comic-1-0-0" src="./assets/img/bg/comic1speech0.png" alt="" />,
            <div className="comic-1-0-0-txt">{t(`comic.1.1`)}</div>,
            <div className="comic-1-0-1 bubble"><div className="text-wrapper">{t(`comic.1.0`)}</div></div>,
            <img className="comic-1-1" src="./assets/img/bg/comic1panel1.png" alt="" />,
            <img className="comic-1-2" src="./assets/img/bg/comic1panel2.png" alt="" />,
            <div className="comic-1-2-1 bubble"><div className="text-wrapper">{t(`comic.1.2`)}</div></div>,
            <img className="comic-1-1-0" src="./assets/img/bg/comic1speech1.png" alt="" />,
            <div className="comic-1-0-0-txt2">{t(`comic.1.3`)}</div>,
        ],
        [
            <img className="comic-3-0" src="./assets/img/bg/timgood.png" alt="" />,
            <div className="comic-3-0-0 bubble"><div className="text-wrapper">{t(`comic.3.good`)}</div></div>,
            <div className="comic-3-0-1 bubble"><div className="text-wrapper">{t(`comic.3.0`)}</div></div>,
        ],
        [
            <img className="comic-3-0" src="./assets/img/bg/timsad.png" alt="" />,
            <div className="comic-3-0-0 bubble"><div className="text-wrapper">{t(`comic.3.bad`)}</div></div>,
            <div className="comic-3-0-1 bubble"><div className="text-wrapper">{t(`comic.3.0`)}</div></div>,

        ],
    ]
    const comicSFX: Record<number, Record<number, string>> = {
        1: {
            4: "sfx/running"
        }
    }

    function onClickComic() {
        if (gameState !== "comic") return;
        if (comics[comic].length <= element) {
            if (comic === 1) {
                setGameState("game")
                return;
            } else if (comic === 0) {        
                setComic(comic + 1);
                setElement(1); 
            }
        } else {
            setElement(element + 1);
        }
        if (comicSFX[comic] && comicSFX[comic][element]) {
            playAudio(G, comicSFX[comic][element]);
        }
    }

    useEffect(() => {
        if (endGame === "good") {
            setComic(2);
            setElement(1);
        } 
        if (endGame === "bad") {
            setComic(3);
            setElement(1);
        } 
    }, [endGame])

    
    return (
        <main className={`comic ${gameState !== "comic" ? "disabled" : ""}`}>
            <div className="comic-wrapper" onClick={onClickComic}>
                {
                    Array(element).fill("").map((_, i) => comics[comic][i])
                }
            </div>
        </main>
    )
}