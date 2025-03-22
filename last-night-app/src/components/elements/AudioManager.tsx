import { useEffect, useState } from "react";
import { GlobalSingleton, useGlobal } from "../../GlobalContextHandler";
import _audio from "../../strings/filenames/audio.json";
import { repeat } from "../debug/DebugTooltip";
const audioFileNames: string[] = _audio;

export const audio: Record<string, HTMLAudioElement> = {};

export default function AudioManager() {
    
    const G = useGlobal();
    const [config, _] = G.config;
    const [playIdx, setPlayIdx] = useState(Math.floor(Math.random() * playList.length));

    useEffect(() => {
        setBGM();
        repeat(() => {
            if (audio[playList[playIdx]].ended) {
                audio[playList[playIdx]].currentTime = 0;
                audio[playList[playIdx]].pause();
                setNextIdx();
            }
        }, 1000)
    }, [])

    function setNextIdx() {
        setPlayIdx((playIdx + 1) % playList.length);
    }
    function setBGM() {
        //audio[playList[playIdx]].addEventListener("ended", () => {setNextIdx}, { once: true });
        playAudio(G, playList[playIdx]);
    }

    useEffect(setBGM, [playIdx])
    
    useEffect(() => {
        audio[playList[playIdx]].volume = config.bgmVolume;
    }, [config])
    
    return <></>
}

audioFileNames.forEach((filename) => {
    const key = filename.replace('public/assets/audio/', '').replace('.mp3', '');
    audio[key] = new Audio(filename);
});

export function playAudio(G: GlobalSingleton, key: string, playEvenIfPlaying = false) {
    const [config, _] = G.config;
    if (key.startsWith("sfx/")) {
        if (config.sfxVolume < 0.05) return;
        audio[key].volume = config.sfxVolume;
    };
    if (key.startsWith("bgm/")) {
        audio[key].volume = config.bgmVolume;
    };
    if (playEvenIfPlaying && audio[key]) {
        audio[key].currentTime = 0
    }
    audio[key]?.play();
}


export const playList = [
    "bgm/massobeats-daydream",
    "bgm/massobeats-mango_tea",
    "bgm/massobeats-peach_prosecco",
    "bgm/massobeats-honey_jam",
    "bgm/massobeats-floral",
]