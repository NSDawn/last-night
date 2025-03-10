import MessagesApp from "../apps/MessagesApp";
import { useGlobal } from "../../GlobalContextHandler"
import { t } from "../../strings/i18n";
import "../apps/Apps.css"
import NotesApp from "../apps/NotesApp";
import QuacklyApp from "../apps/QuacklyApp";
import NotifHandler from "../elements/NotifHandler";

export default function Screen() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    
    const appIcons: AppIconData[] = [
        { id: "messages", iconUrl: "/assets/img/ui/appicon-messages.png", appNode: <MessagesApp />},
        {id: "notes", iconUrl: "/assets/img/ui/appicon-notes.png", appNode: <NotesApp />},
        {id: "settings", iconUrl: "/assets/img/ui/appicon-settings.png", appNode: undefined},
        {id: "quackly", iconUrl: "/assets/img/ui/appicon-quackly.png", appNode: <QuacklyApp />},
    ];

    return (
        <section className={`screen ${currentApp ?? "home"}`}>
            <section className="home-screen">
                {appIcons.map((appIcon, i) => 
                    <div className={`app-icon ${appIcon.id}`} key={i}>
                        <button onClick={() => setCurrentApp(appIcon.id)}>
                            <img src={appIcon.iconUrl} alt={`app icon ${appIcon.id}`} />
                        </button>
                        <div className="app-name">
                            {t(`app.${appIcon.id}`)}
                        </div>
                    </div>
                )}
            </section>
            {appIcons.map((appIcon, i) => 
                <section className={`app ${appIcon.id} ${currentApp !== appIcon.id ? "disabled" : ""}`} key={i}>
                    {appIcon.appNode}
                </section>
            )}
            <NotifHandler />
        </section>
    )
}

type AppIconData = {
    id: string;
    iconUrl: string;
    appNode?: React.ReactNode;
}