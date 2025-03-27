import { useEffect, useRef, useState } from "react";
import { GlobalSingleton, useGlobal } from "../../GlobalContextHandler";
import _audio from "../../strings/filenames/audio.json";
import { repeat } from "../debug/DebugTooltip";
const audioFileNames: string[] = _audio;

export const audio: Record<string, HTMLAudioElement> = {};

audioFileNames.forEach((filename) => {
    const key = filename.replace('public/assets/audio/', '').replace('.mp3', '');
    audio[key] = new Audio(filename);
});

export default function AudioManager() {
    
    const G = useGlobal();
    const [config, _] = G.config;
    const [playIdx, setPlayIdx] = useState(Math.floor(Math.random() * playList.length));
    const hasStartedRepeat = useRef(false);

    useEffect(() => {
        const playSong = () => {
          const song = playList[playIdx];
          if (!audio[song]) {
            audio[song] = new Audio(`${song}.mp3`);
          }
    
          const currentAudio = audio[song];
          playAudio(G, song);
    
          currentAudio.onended = () => {
            setPlayIdx((prevIndex) => (prevIndex + 1) % playList.length);
          };
        };
    
        playSong();
    
        return () => {
          audio[playList[playIdx]]?.pause();
        };
    }, [playIdx]);
    
    useEffect(() => {
        audio[playList[playIdx]].volume = config.bgmVolume;
    }, [config])
    
    return <></>
}


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