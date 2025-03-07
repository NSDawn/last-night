import { useGlobal } from "../../GlobalContextHandler";

export default function MessagesApp() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;

    return (
        <>
            this is the messages app
        </>
    )
}