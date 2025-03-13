import { useEffect, useState } from "react";
import { GlobalSingleton, useGlobal } from "../../GlobalContextHandler";
import "./NotifHandler.css";
import { t } from "../../strings/i18n";
import { getUser } from "../../game/Messages";
import { playAudio } from "../../game/AudioManager";

export default function NotifHandler() {

    const G = useGlobal()
    const [notifStack, setNotifStack] = G.notifStack;
    const [isNotifying, setIsNotifying] = useState(false);
    const NOTIF_LENGTH_MS = 1500;

    useEffect(() => {
        if (isNotifying) return;
        if (notifStack.length > 0) {
            setIsNotifying(true);
            if (notifStack[0].type === "topic") {
                playAudio(G, "sfx/notif-short")
            } else {
                playAudio(G, "sfx/notif-long");

            }
            setTimeout(() => {
                popNotif(G);
                setIsNotifying(false);
            }, NOTIF_LENGTH_MS)
        }
    }, [notifStack, isNotifying])

    return (
        <>
        {isNotifying? 
            <div className={`push-notif ${notifStack[0].type === "topic" ? "topic" : ""}`}>
                {notifStack[0].userId?
                    <div className="pfp">
                        <img src={`${getUser(notifStack[0].userId).pfpUrl}`} alt="push notification profile picture" />
                    </div>
                : null}
                
                <div className="text">
                    {t(`notif.${notifStack[0].type}`).replace("$USER", t(`char.${notifStack[0].userId}.truncatedName`))}
                </div>
            </div>
        : null}
        </>
        
    )
}

export type Notif = {
    type: "quack" | "message" | "newUser" | "topic";
    userId?: string;
}

export function pushNotif(G: GlobalSingleton, type: "quack" | "message" | "newUser" | "topic", userId: string | undefined) {
    const [notifStack, setNotifStack] = G.notifStack;
    const newNotif: Notif = {type: type, userId: userId};
    setNotifStack([...notifStack, newNotif])
} 

export function popNotif(G: GlobalSingleton) {
    const [notifStack, setNotifStack] = G.notifStack;
    setNotifStack(notifStack.slice(1, notifStack.length -1));
}