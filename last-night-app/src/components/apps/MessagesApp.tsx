import { getUser, MessageHistory } from "../../game/Messages";
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";

export default function MessagesApp() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    const [messageHistory, __setMessageHistory] = G.messageHistory;

    return (
        <>  
            <header>
                <button className="back-button">
                   {`🏠`}
                </button>
                <h1>
                    {t(`app.messages.userList.h`)}
                </h1>
            </header>
            <UserList messageHistory={messageHistory}/>
        </>
    )
}

function UserList(props: {messageHistory: MessageHistory}) {
    return ( 
        <div className="user-list">
            {props.messageHistory.map((userMessageHistory, i) => 
                <div className="user" key={i}> 
                    <div className="pfp">
                        <img src={getUser(userMessageHistory.userId).pfpUrl} alt={`${t(`char.${userMessageHistory.userId}.displayName`)} profile picture`} />
                    </div>
                    <div className="text">
                        <div className="user-name">
                            {t(`char.${userMessageHistory.userId}.displayName`)}
                        </div>
                        <div className="message-preview">
                            You: This is the last message sent in this convo.
                        </div>
                    </div>
                </div>
            )}
        </div> 
    )
}