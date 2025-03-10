import { useEffect, useRef, useState } from "react";
import { addChainMessageHistory, getMessage, getMessageChain, getTopic, getUser, incrementShownMessagesMessageHistory, matchMessageChainRequest, MessageHistory, resolveMessageChainEvents, TopicInventory, UserMessageHistory } from "../../game/Messages";
import { State, useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";

export default function MessagesApp() {

    const G = useGlobal();
    const [currentApp, setCurrentApp] = G.currentApp;
    const [messageHistory, setMessageHistory] = G.messageHistory;
    const [_, setMessageHistoryJSON] = G.messageHistoryJSON;
    const [selectedUser, setSelectedUser] = useState(null as string | null);

    return (
        <>  
            <header>
                <button className={`back-button ${selectedUser === null ? "disabled" : ""}`} onClick={() => setSelectedUser(null)}>
                   <img src="assets/img/ui/icon-back.png" alt="back icon" />
                </button>
                <img className={`pfp ${selectedUser === null ? "disabled" : ""}`} src={`${getUser(selectedUser).pfpUrl}`} alt={`${selectedUser} profile picture`} />
                <h1>
                    { selectedUser !== null ? 
                        t(`char.${selectedUser}.displayName`)
                    : t(`app.messages.userList.h`)}
                </h1>
                <button className="home-button" onClick={() => setCurrentApp(null)}>
                   <img src="assets/img/ui/icon-home.png" alt="home icon" />
                </button>
            </header>
            <main>
                <UserList messageHistory={messageHistory} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <Chat messageHistory={messageHistory} selectedUser={selectedUser} setSelectedUser={setSelectedUser} setMessageHistoryJSON={setMessageHistoryJSON}/>
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
                            {
                                `${t(`char.${getMessage(getLastMessageId(userMessageHistory)).senderId}.truncatedName`)}: ${
                                    t(`message.${getLastMessageId(userMessageHistory)}`)
                                }`
                            }
                        </div>
                        { getHasNotifications(userMessageHistory) ?
                            <div className="notification">
                                <img src="assets/img/ui/icon-notif.png" alt="notification icon" />
                            </div>
                        : null}
                    </div>
                </div>
            )}
        </div> 
    )
}

function getLastMessageId(userMessageHistory: UserMessageHistory) {
    return (userMessageHistory.messageChainIds
            .reduce((a, v) => a.concat(getMessageChain(v).messageIds), [] as string[])[userMessageHistory.shownMessages ?? 0])
}

function getHasNotifications(userMessageHistory: UserMessageHistory): boolean {
    return (
        userMessageHistory.messageChainIds.reduce((a, v) => a.concat(getMessageChain(v).messageIds), [] as string[]).length > ((userMessageHistory.shownMessages ?? 0) +1)
    )
}

function Chat(props: {messageHistory: MessageHistory, selectedUser: string|null, setSelectedUser: (user: string|null) => void, setMessageHistoryJSON: (s: string) => void}) {
    
    const G = useGlobal();
    const [topicInventory, setTopicInventory] = G.topicInventory;
    const userMessageHistory = props.messageHistory.filter((h) => h.userId === props.selectedUser)[0];
    let prevUserId = "";
    let shownMessagesI = 0;
    const [hasMoreDialogue, setHasMoreDialogue] = useState(true);

    const [topicSelectIsHidden, setTopicSelectIsHidden] = useState(hasMoreDialogue);
    
    useEffect(() => {
        if (!userMessageHistory) return;
        let totalMessages = -2; // dunno why im setting this to -2
        userMessageHistory.messageChainIds.forEach((messageChainId) => getMessageChain(messageChainId).messageIds.forEach(_ => totalMessages ++) );
        setHasMoreDialogue(totalMessages >= (userMessageHistory.shownMessages ?? 0));
    }, [userMessageHistory]);

    function chatHistoryOnClick() {
        if (!hasMoreDialogue) return;
        incrementShownMessagesMessageHistory(G, 1, props.selectedUser);
        const messageHistoryFiltered = props.messageHistory.filter((h) => h.userId !== props.selectedUser);
        props.setMessageHistoryJSON(JSON.stringify([userMessageHistory, ...messageHistoryFiltered]));
    }

    useEffect(() => {
        const chatHistoryDiv = document.querySelector("div.chat-history");
        scrollToTheBottom(chatHistoryDiv);
    }, [props.messageHistory, props.selectedUser, topicSelectIsHidden]);

    useEffect(() => {
        setTopicSelectIsHidden(hasMoreDialogue);
        if (!hasMoreDialogue) {
            // scroll to the bottom
            setTimeout(() => {
                const chatHistoryDiv = document.querySelector("div.chat-history");
                scrollToTheBottom(chatHistoryDiv);
            }, 251);
            // resolve events
            resolveMessageChainEvents(G, userMessageHistory.messageChainIds[userMessageHistory.messageChainIds.length -1]);
        }
    }, [hasMoreDialogue])
    

    return (
        <div className={`chat ${props.selectedUser === null ? "disabled" : ""}`}>
            <div className="chat-history" onClick={chatHistoryOnClick} >
                
                {props.selectedUser !== null ? 
                    
                    userMessageHistory.messageChainIds.map((messageChainId) => getMessageChain(messageChainId).messageIds.map((messageId, i) => 
                        {
                            if (shownMessagesI > (userMessageHistory.shownMessages ?? 0)) {
                                return;
                            };
                            shownMessagesI ++;
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
                                    { t(`message.${messageId}`) }
                                    { message.imgUrl ? <img src={message.imgUrl} alt="message image" /> : null }
                                </div>
                            </div>)
                        }
                        
                    ))               
                : null}
                {hasMoreDialogue?
                    <div className="click-to-continue">
                        <img  src="assets/img/ui/mouse-click.gif" alt="click to continue" />
                        
                    </div>
                : null}
            </div>
            
            <TopicSelect topicInventory={topicInventory} isHidden={topicSelectIsHidden} setIsHidden={setTopicSelectIsHidden} selectedUser={props.selectedUser}/>
        </div>
    )
}

function scrollToTheBottom(div: Element | null) {
    if (!div) return;
    div.scrollTop = div.scrollHeight;
}

function TopicSelect(props: {topicInventory: TopicInventory, isHidden: boolean, setIsHidden: (f: boolean) => void, selectedUser: string | null} ) {
    
    const G = useGlobal();
    const [selectedTopics, setSelectedTopics] = useState([] as string[]);
    const [selectedCategory, setSelectedCategory] = useState(null as string|null);
    const [flags, setFlags] = G.flags;
    const MAX_TOPICS = 3;

    const categories = [
        {name: "all", imgUrl: "assets/img/ui/icon-pages.png", value: null},
        {name: "person", imgUrl: "assets/img/ui/icon-person.png", value: "person"},
        {name: "place", imgUrl: "assets/img/ui/icon-place.png", value: "place"},
        {name: "thing", imgUrl: "assets/img/ui/icon-star.png", value: "thing"},
        {name: "action", imgUrl: "assets/img/ui/icon-speech.png", value: "action"},
    ]
    
    function onClickTopic(topicId: string) {
        if (selectedTopics.includes(topicId)) {
            setSelectedTopics(selectedTopics.filter((id) => topicId !== id));
        } else {
            if (selectedTopics.length < MAX_TOPICS) {
                setSelectedTopics(selectedTopics.concat([topicId]));
            }
        }

    }

    function onClickSend() {
        if (!props.selectedUser) return;
        const match = matchMessageChainRequest({
            topicIds: [...selectedTopics],
            userId: props.selectedUser,
            requiredFlags: []
        }, flags)
        if (!match) return;
        if (!match.chainId) return;
        addChainMessageHistory(G, match.chainId, props.selectedUser);
        incrementShownMessagesMessageHistory(G, 1, props.selectedUser);
    }

    useEffect(() => {
        setSelectedTopics([]);
        setSelectedCategory(null);
    }, [props.isHidden])
    
    return (
        <div className={`topic-select ${props.isHidden ? "hidden" : ""}`}>
            {!props.isHidden ? <>
                <div className="send">
                    <div className="message-bar">
                        {selectedTopics.map((topicId, i) => {
                            return (<div className="selected-topic" onClick={() => onClickTopic(topicId)} key={i}>
                                {t(`topic.${topicId}`)}
                            </div>)
                        })}
                    </div>
                    <button className="send-button" onClick={onClickSend}>
                        <img src="assets/img/ui/icon-send.png" alt="send button" />
                    </button>
                </div>
                <div className="topic-inventory">
                    <div className="category-select">
                        {categories.map((category) => <button className={`category-button ${selectedCategory === category.value ? "selected" : ""}`} onClick={() => setSelectedCategory(category.value)}>
                            <img src={category.imgUrl} alt={`${category.name} category button`} />
                        </button>)}
                    </div>
                    <div className="topics"> 
                        {props.topicInventory.map((topicId) => {
                            const topic = getTopic(topicId);
                            if (selectedCategory !== null && topic.category !== selectedCategory) return;
                            if (selectedTopics.includes(topicId)) return;
                            return (
                                <div className={`topic ${selectedTopics.length >= MAX_TOPICS ? "disabled": ""}`} onClick={() => onClickTopic(topicId)}>
                                    {t(`topic.${topicId}`)}
                                </div>
                            )
                        })}
                    </div>
                </div>
                
            </>: null }
            

        </div>
    )
}