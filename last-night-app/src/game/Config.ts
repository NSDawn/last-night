import { GlobalSingleton } from "../GlobalContextHandler";

export type Config = {
    sfxEnabled: boolean;
}

export function getDefaultConfig(): Config {
    return {
        sfxEnabled: true,
    }
}

export function changeConfig(G: GlobalSingleton, key: string, value: any) {
    const [config, _] = G.config;
    const [__, setConfigJSON] = G.configJSON;
    
    // @ts-ignore
    config[key] = value;

    setConfigJSON(JSON.stringify(config));
}