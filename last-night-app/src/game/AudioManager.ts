import { GlobalSingleton } from "../GlobalContextHandler";
import _audio from "../strings/filenames/audio.json";
const audioFileNames: string[] = _audio;

export const audio: Record<string, HTMLAudioElement> = {};

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
    if (playEvenIfPlaying && audio[key]) {
        audio[key].currentTime = 0
    }
    audio[key]?.play();
}