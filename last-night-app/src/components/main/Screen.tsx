import MessagesApp from "../apps/MessagesApp";
import { useGlobal } from "../../GlobalContextHandler"
import { t } from "../../strings/i18n";
import "../apps/Apps.css"

export default function Screen() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    
    const appIcons: AppIconData[] = [
        {
            id: "messages", 
            icon: "💬", 
            appNode: <MessagesApp />,
        },
        {id: "notes", icon: "📝", appNode: undefined},
        {id: "settings", icon: "⚙️", appNode: undefined},
    ];

    return (
        <section className={`screen ${currentApp ?? "home"}`}>
            <section className="home-screen">
                {appIcons.map((appIcon, i) => 
                    <div className={`app-icon ${appIcon.id}`} key={i}>
                        <button onClick={() => setCurrentApp(appIcon.id)}>
                            {appIcon.icon}
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
                
        </section>
    )
}

type AppIconData = {
    id: string;
    icon: string;
    appNode?: React.ReactNode;
}