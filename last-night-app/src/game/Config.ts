import { GlobalSingleton } from "../GlobalContextHandler";

export type Config = {
    sfxVolume: number;
    bgmVolume: number;
}

export function getDefaultConfig(): Config {
    return {
        sfxVolume: 0.5,
        bgmVolume: 0.075,
    }
}

export function changeConfig(G: GlobalSingleton, key: string, value: any) {
    const [config, _] = G.config;
    const [__, setConfigJSON] = G.configJSON;
    
    // @ts-ignore
    config[key] = value;

    setConfigJSON(JSON.stringify(config));
}