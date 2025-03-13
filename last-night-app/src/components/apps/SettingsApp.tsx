import { useEffect, useState } from "react"
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";
import { changeConfig } from "../../game/Config";
import { playAudio } from "../../game/AudioManager";

export default function SettingsApp() {
    
    const G = useGlobal()
    const [config, _] = G.config;
    const [currentApp, setCurrentApp] = G.currentApp;
    const [sfxVolumeInput, setSfxVolumeInput] = useState(config.sfxVolume * 100);

    useEffect(() => {
        changeConfig(G, "sfxVolume", sfxVolumeInput/100);
    }, [sfxVolumeInput]);

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
                        {t(`settings.audio.sfx`)}
                    </div>
                    <div className="setter">
                        <button
                        className="play-sfx img-button"
                        onClick={() => {playAudio(G, "sfx/notif-short", true)}}>
                            <img src="assets/img/ui/icon-back.png" alt="play sfx icon" />
                        </button>
                        <input 
                            type="range" 
                            value={sfxVolumeInput}
                            onChange={(e) => {setSfxVolumeInput(parseFloat(e.target.value))}}
                        />
    
                    </div>
                </div>
                
            </div>
        </main>
    </>)
}