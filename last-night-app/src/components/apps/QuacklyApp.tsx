import { getUser } from "../../game/Messages";
import { getQuack } from "../../game/Quacks";
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";

export default function QuacklyApp() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    const [quacks, setQuacks] = G.quacks;

    return (
        <>
            <header>    
                <h1>
                    {t(`app.quackly`)}
                </h1>
                <button className="home-button" onClick={() => setCurrentApp(null)}>
                   <img src="assets/img/ui/icon-home.png" alt="home icon" />
                </button>
            </header>
            <main>
                <div className="quack-history">
                    {quacks.map((quackId, i) => {
                        const quack = getQuack(quackId);
                        const user = getUser(quack.userId);
                            
                        return (<div className="quack" key={i}>
                            <div className="pfp-wrapper">
                                <div className="pfp">
                                    <img src={user.pfpUrl} alt={`profile picture ${user.id}`} />
                                </div>
                                <div className="timestamp">
                                    {quack.timestamp}
                                </div>
                            </div>
                            
                            <div className="text">
                                <div className="blurb">{
                                    t("quack.blurb")
                                        .replace("$USER", t(`char.${user.id}.displayName`))
                                        .replace("$USERHANDLE", user.quacklyHandle)
                                }</div>
                                <h3>{t(`quack.${quack.id}`)}</h3>
                            </div> 
                        </div>)
                    })}
                </div>
                
            </main>
        </>
    )
}