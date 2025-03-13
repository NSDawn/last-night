import { useEffect, useState } from "react"
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";
import { changeConfig } from "../../game/Config";
import { playAudio } from "../elements/AudioManager";

export default function SettingsApp() {
    
    const G = useGlobal()
    const [config, _] = G.config;
    const [currentApp, setCurrentApp] = G.currentApp;
    const [sfxVolumeInput, setSfxVolumeInput] = useState(config.sfxVolume * 100);
    const [sfxVolumeButtonSrc, setSfxVolumeButtonSrc] = useState("");
    const [bgmVolumeInput, setBgmVolumeInput] = useState(config.bgmVolume * 200);
    // const [bgmVolumeSrc, setBgmVolumeSrc] = useState("");

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
                        {/* <button
                        className="play-bgm img-button"
                        onClick={() => {playAudio(G, "sfx/notif-short", true)}}>
                            <img 
                                src={sfxVolumeButtonSrc} 
                                alt="play sfx icon" 
                            />
                        </button> */}
                        <input 
                            type="range" 
                            value={bgmVolumeInput}
                            onChange={(e) => {setBgmVolumeInput(parseFloat(e.target.value))}}
                        />
                    </div>
                </div>
                
            </div>
        </main>
    </>)
}

