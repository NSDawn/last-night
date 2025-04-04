import { useEffect, useState } from "react"
import { loadSaveData, makeSaveData, pullSaveData, storeSaveData, useGlobal } from "../../GlobalContextHandler";
import { t, tDate } from "../../strings/i18n";
import { changeConfig } from "../../game/Config";
import { playAudio } from "../elements/AudioManager";

export default function SettingsApp() {
    
    const G = useGlobal()
    const [config, _] = G.config;
    const [currentApp, setCurrentApp] = G.currentApp;
    const [sfxVolumeInput, setSfxVolumeInput] = useState(config.sfxVolume * 100);
    const [sfxVolumeButtonSrc, setSfxVolumeButtonSrc] = useState("");
    const [bgmVolumeInput, setBgmVolumeInput] = useState(config.bgmVolume * 200);
    const [saveTimestampStrings, setSaveTimestampStrings] = useState(["", "", ""]);

    useEffect(updateTimestampStrings, []);
    
    useEffect(() => {
        changeConfig(G, "sfxVolume", sfxVolumeInput/100);
        setSfxVolumeButtonSrc(getVolumeButtonSrc(sfxVolumeInput))
    }, [sfxVolumeInput]);

    useEffect(() => {
        changeConfig(G, "bgmVolume", bgmVolumeInput/200);
    }, [bgmVolumeInput]);

    function getVolumeButtonSrc(volume: number) {
        if (volume === 0) return "assets/img/ui/icon-mute.png";
        if (volume <= 30) return "assets/img/ui/icon-volume-0.png";
        if (volume <= 50) return "assets/img/ui/icon-volume-1.png";
        if (volume <= 70) return "assets/img/ui/icon-volume-2.png";
        return "assets/img/ui/icon-volume-3.png";
    }

    function saveOrLoadButtonClicked(slot: number, mode: "save" | "load") {
        if (mode === "save") {
            storeSaveData(makeSaveData(G), slot)
            updateTimestampStrings();
        }
        if (mode === "load") {
            let data = pullSaveData(slot);
            if (data) loadSaveData(G, data);
        }
    }

    function updateTimestampStrings() {
        setSaveTimestampStrings(saveTimestampStrings.map((_, slot) => {
                let data = pullSaveData(slot);
                if (data && data.timestamp) return tDate(data.timestamp, "settings.save.date");
                //TODO: write a date to string function based on t
                return "";
            }
        ));
    }

    function hasSaveData(index: number) {
        return saveTimestampStrings[index] !== "";
    }

    function getTimestampT(index: number) {
        return saveTimestampStrings[index] === "" ? t("settings.save.emptySlot") : saveTimestampStrings[index];
    }

    return (<>
        <header>    
            <h1>
                {t(`app.settings`)}
            </h1>
            <button className="home-button" onClick={() => setCurrentApp(null)}>
                <img src="assets/img/ui/icon-home.png" alt="home icon" />
            </button>
        </header>
        <main>
            <div className="category">
                <h2>
                    {t(`settings.audio.h`)}
                </h2>
                <div className="setting sfx-volume">
                    <div className="setting-label">
                        <div>
                            {t(`settings.audio.sfx`)}
                        </div>
                    </div>
                    <div className="setter">
                        <button
                        className="play-sfx img-button"
                        onClick={() => {playAudio(G, "sfx/notif-short", true)}}>
                            <img 
                                src={sfxVolumeButtonSrc} 
                                alt="play sfx icon" 
                            />
                        </button>
                        <input 
                            type="range" 
                            value={sfxVolumeInput}
                            onChange={(e) => {setSfxVolumeInput(parseFloat(e.target.value))}}
                        />
                    </div>
                </div>
                <div className="setting bgm-volume">
                    <div className="setting-label">
                        <div>
                            {t(`settings.audio.bgm`)}
                        </div>
                    </div>
                    <div className="setter">
                        <input 
                            type="range" 
                            value={bgmVolumeInput}
                            onChange={(e) => {setBgmVolumeInput(parseFloat(e.target.value))}}
                        />
                    </div>
                </div>
                
            </div>
            <div className="category">
                <h2>
                    {t(`settings.credits.h`)}
                </h2>
                <div className="setting credit-conflxted">
                    <div className="setting-label">
                        <div>
                            {t(`settings.credits.conflxted.role`)}
                        </div>
                    </div>
                    <div className="setter">
                        <a href="https://conflxcted.itch.io/" target="_blank">
                            {t(`settings.credits.conflxted`)}
                        </a>
                    </div>
                </div>
                <div className="setting credit-atumemot">
                    <div className="setting-label">
                        <div>
                            {t(`settings.credits.atumemot.role`)}
                        </div>
                    </div>
                    <div className="setter">
                        <a href="https://atumemot.itch.io/" target="_blank">
                            {t(`settings.credits.atumemot`)}
                        </a>
                    </div>
                </div>
                <div className="setting credit-nsdawn">
                    <div className="setting-label">
                        <div>
                            {t(`settings.credits.nsdawn.role`)}
                        </div>
                    </div>
                    <div className="setter">
                        <a href="https://ns-dawn.itch.io/" target="_blank">
                            {t(`settings.credits.nsdawn`)}
                        </a>
                    </div>
                </div>
                <div className="setting credit-audio">
                    <div className="setting-label">
                        <div>
                            {t(`settings.credits.audio.role`)}
                        </div>
                    </div>
                    <div className="setter">
                        <a href="https://github.com/NSDawn/last-night?tab=readme-ov-file#asset-credits" target="_blank">
                            {t(`settings.credits.audio`)}
                        </a>
                    </div>
                </div>
            </div>
            <div className="category">
                <h2>
                    {t(`settings.save.h`)}
                </h2>

                {saveTimestampStrings.map((v, i) => 
                    <div className="setting save" key={i}>
                        <div className="setting-label">
                            <div>
                                {t(`settings.save.slot.${i}`)}
                            </div>
                        </div>
                        <div className="setter">
                            <button className="save" onClick={() => saveOrLoadButtonClicked(i, "save")}>
                                {t(hasSaveData(i) ? "settings.save.overwrite" : `settings.save.save`)}
                            </button>
                            {hasSaveData(i) ?
                                <button className="load" onClick={() => saveOrLoadButtonClicked(i, "load")}>
                                    {t(`settings.save.load`)} 
                                </button>
                            :null}
                            <div className="timestamp">
                                {getTimestampT(i)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </>)
}

