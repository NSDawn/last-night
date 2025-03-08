import { useState } from "react";
import { getMessage, getMessageChain, getUser, MessageHistory } from "../../game/Messages";
import { State, useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";

export default function MessagesApp() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    const [messageHistory, setMessageHistory] = G.messageHistory;
    const [selectedUser, setSelectedUser] = useState(null as string | null);

    return (
        <>  
            <header>
                <button className={`back-button ${selectedUser === null ? "disabled" : ""}`} onClick={() => setSelectedUser(null)}>
                   <img src="/assets/img/ui/icon-home.png" alt="back icon" />
                </button>
                <img className={`pfp ${selectedUser === null ? "disabled" : ""}`} src={`${getUser(selectedUser).pfpUrl}`} alt={`${selectedUser} profile picture`} />
                <h1>
                    { selectedUser !== null ? 
                        t(`char.${selectedUser}.displayName`)
                    : t(`app.messages.userList.h`)}
                </h1>
                <button className="home-button" onClick={() => setCurrentApp(null)}>
                   <img src="/assets/img/ui/icon-home.png" alt="home icon" />
                </button>
            </header>
            <main>
                <UserList messageHistory={messageHistory} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <Chat messageHistory={messageHistory} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </main>
        </>
    )
}

function UserList(props: {messageHistory: MessageHistory, selectedUser: string|null, setSelectedUser: (user: string|null) => void}) {
    return ( 
        <div className={`user-list ${props.selectedUser !== null ? "disabled" : ""}`}>
            {props.messageHistory.map((userMessageHistory, i) => 
                <div className="user" key={i} role="button" onClick={() => props.setSelectedUser(userMessageHistory.userId)}> 
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
function Chat(props: {messageHistory: MessageHistory, selectedUser: string|null, setSelectedUser: (user: string|null) => void}) {
    
    const userMessageHistory = props.messageHistory.filter((h) => h.userId === props.selectedUser)[0];
    let prevUserId = "";

    return (
        <div className={`chat ${props.selectedUser === null ? "disabled" : ""}`}>
            <div className="chat-history">
                {props.selectedUser !== null ? 
                    
                    userMessageHistory.messageChainIds.map((messageChainId) => getMessageChain(messageChainId).messageIds.map((messageId, i) => 
                        {
                            const message = getMessage(messageId);
                            const sender = getUser(message.senderId);
                            const sameUser = i !== 0 &&  message.senderId == prevUserId;
                            prevUserId = message.senderId;
                            const isPlayer = sender.isPlayer ?? false;

                            return (<div className={`message ${!sameUser ? "new-user": ""} ${isPlayer ? "player": ""}`} key={i}> 
                                <div className="pfp">
                                    {!sameUser? 
                                        <img src={sender.pfpUrl} alt={`${sender} profile picture`} />
                                    : null}
                                </div>
                                <div className="text">
                                    {
                                        t(`message.${messageId}`)
                                    }
                                </div>
                            </div>)
                        }
                        
                    ))               
                
                : null}
            </div>
            
        </div>
    )
}