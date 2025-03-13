import _messageData from "../data/MessageData.json";
const messageData: Record<string, Message> = _messageData;

export type Message = {
    id: string;
    senderId: string;
    imgUrl?: string;
}
export function getMessage(key: string): Message {
    const DEFAULT_KEY = "debug.debugscene.0.0";
    return messageData[key] ?? messageData[DEFAULT_KEY];
}

import _messageChainData from "../data/MessageChainData.json";
const messageChainData: Record<string, MessageChain> = _messageChainData;
export type MessageChain = {
    id: string;
    messageIds: string[]; // ids
    repeatable?: boolean;
    events?: {
        addFlags?: string[];
        removeFlags?: string[];
        getTopics?: string[];
        removeTopics?: string | string[];
        delayMs?: number;
        addUsers?: string[];
        addQuacks?: string[]; // supply in reverse chrono order
        startChains?: {userId: string, chainId: string}[];
        endGameGood?: boolean;
        endGameBad?: boolean;
    }
}
export function getMessageChain(key: string): MessageChain {
    const DEFAULT_KEY = "debug.debugscene.0";
    return messageChainData[key] ?? messageChainData[DEFAULT_KEY];
}
export function resolveMessageChainEvents(G: GlobalSingleton, key: string) {
    const [resolvedMessageChains, setResolvedMessageChains] = G.resolvedMessageChains;
    if (resolvedMessageChains.includes(key)) return;
    const chain = getMessageChain(key);
    if (!chain.repeatable) {
        setResolvedMessageChains([...resolvedMessageChains, chain.id]);
    }
    if (!chain.events) return;
    const [flags, setFlags] = G.flags;
    let tempFlags = [...flags];

    if (chain.events.removeFlags) {
        for (let flag of chain.events.removeFlags)
            tempFlags = removeFlag(tempFlags, flag);
    } 
    if (chain.events.addFlags) {
        for (let flag of chain.events.addFlags)
            tempFlags = addFlag(tempFlags, flag)
    }
    setFlags(tempFlags);

    if (chain.events.getTopics || chain.events.removeTopics) {
        addOrRemoveTopics(G, chain.events.getTopics ?? [], chain.events.removeTopics ?? []);
        if (chain.events.getTopics) {
            
            pushNotif(G, "topic", undefined);
        }
    };
    setTimeout(() => {
        if (chain.events?.addQuacks) {
            addQuack(G, chain.events?.addQuacks)
            const userId = getQuack(chain.events?.addQuacks[0]).userId
            pushNotif(G, "quack", userId);
        };
        if (chain.events?.addUsers) chain.events?.addUsers.forEach((user) => {
            addUserMessageHistory(G, user);
            pushNotif(G, "newUser", user);
        });
        if (chain.events?.startChains) chain.events?.startChains.forEach((chain) => {
            addChainMessageHistory(G, chain.chainId, chain.userId);
            pushNotif(G, "message", chain.userId);
        });
        const [_, setEndGame] = G.endGame;
        const [__, setGameState] = G.gameState;
        if (chain.events?.endGameBad) {
            setEndGame("bad");
            setGameState("comic");
        }
        if (chain.events?.endGameGood) {
            setEndGame("good");
            setGameState("comic");
        }
    }, chain.events.delayMs ?? 0)
}

import _messageChainRequestData from "../data/MessageChainRequestData.json";
const messageChainRequestData: MessageChainRequest[] = _messageChainRequestData;
export type MessageChainRequest = {
    topicIds: string[],
    userId: string,
    requiredFlags: string[],
    chainId?: string,
}

export function matchMessageChainRequest(request: MessageChainRequest, flags: string[]): MessageChainRequest | null {
    const matches = messageChainRequestData
        .filter((rq) => rq.userId === request.userId)
        .filter((rq) => !rq.topicIds.some((topic) => !request.topicIds.includes(topic)))
        .filter((rq) => rq.topicIds.length === request.topicIds.length)
        .filter((rq) => !rq.requiredFlags.some((flag) => !flags.includes(flag)))
        .sort((rqA, rqB) => rqB.requiredFlags.length - rqA.requiredFlags.length)
    ;
    if (matches.length === 0) return null;
    return matches[0]
}

import _userData from "../data/UserData.json";
import { GlobalSingleton } from "../GlobalContextHandler";
const userData: Record<string, User> = _userData;
export type User = {
    id: string;
    pfpUrl: string;
    quacklyHandle: string;
    isPlayer?: boolean;
}
export function getUser(key: string | null): User {
    const DEFAULT_USER = userData["debugShrek"]
    if (!key) return DEFAULT_USER;
    return userData[key] ?? DEFAULT_USER;
}

export type MessageHistory = UserMessageHistory[];

export type UserMessageHistory = {
    userId: string;
    shownMessages?: number;
    messageChainIds: string[];
}

// ! ====
export function getDefaultMessageHistory(): MessageHistory {
    return [
        {
            userId: "kaytlyn",
            messageChainIds: [
                "kaytlyn.1.0"
            ],
        }
    ]
}

export function addUserMessageHistory(G: GlobalSingleton, userId: string) {
    const [messageHistory, _] = G.messageHistory;
    messageHistory.push({
        userId: userId,
        messageChainIds: [
        ] as string[]
    } as UserMessageHistory)
    updateMessageHistory(G, messageHistory);
}

export function addChainMessageHistory(G: GlobalSingleton, chainId: string, userId: string) {
    const [messageHistory, _] = G.messageHistory;

    let userMessageHistory = messageHistory.filter((v) => v.userId === userId)[0];
    if (!userMessageHistory) {
        addUserMessageHistory(G, userId)
        userMessageHistory = messageHistory.filter((v) => v.userId === userId)[0];
    };

    userMessageHistory.messageChainIds.push(chainId);

    updateMessageHistory(G, messageHistory);
}

export function incrementShownMessagesMessageHistory(G: GlobalSingleton, addend: number, userId: string | null) {
    if (!userId) return;
    const [messageHistory, _] = G.messageHistory;

    const userMessageHistory = messageHistory.filter((v) => v.userId === userId)[0];
    if (!userMessageHistory) return;

    if (userMessageHistory.shownMessages === undefined) userMessageHistory.shownMessages = 0;
    userMessageHistory.shownMessages += addend;
    updateMessageHistory(G, messageHistory);
}

export function updateMessageHistory(G: GlobalSingleton, messageHistory: MessageHistory) {
    const [_, setMessageHistoryJSON] = G.messageHistoryJSON;
    setMessageHistoryJSON(JSON.stringify(messageHistory));
}

import _topicData from "../data/TopicData.json";
import { addFlag, removeFlag } from "./Flags";
import { addQuack, getQuack } from "./Quacks";
import { pushNotif } from "../components/elements/NotifHandler";
const topicData: Record<string, Topic> = _topicData;

export type TopicInventory = string[];

export type Topic = {
    id: string,
    category: string,
}

export function getDefaultTopicInventory(): TopicInventory {
    return [
        "hey"
    ];
}

export function getTopic(key: string) {
    const DEFAULT_KEY = "debugTopic";
    return topicData[key] ?? topicData[DEFAULT_KEY];
}

export function addTopics(G: GlobalSingleton, topics: string | string[]) {
    const topicsToAdd = (typeof topics == "string") ? [topics] : topics
    const [topicInventory, _] = G.topicInventory;
    updateTopicInventory(G, [...topicInventory, ...topicsToAdd]);
}

export function addOrRemoveTopics(G: GlobalSingleton, topicsToAdd: string | string[], topicsToRemove: string | string[]) {
    const topicsToAdd2 = (typeof topicsToAdd == "string") ? [topicsToAdd] : topicsToAdd;
    const topicsToRemove2 = (typeof topicsToRemove == "string") ? [topicsToRemove] : topicsToRemove;
    const [topicInventory, _] = G.topicInventory;
    const removed = topicInventory.filter((topic) => !topicsToRemove2.includes(topic));
    updateTopicInventory(G, [...removed, ...topicsToAdd2])
}

export function updateTopicInventory(G: GlobalSingleton, topicInventory: TopicInventory) {
    const [_, setTopicInventoryJSON] = G.topicInventoryJSON;
    setTopicInventoryJSON(JSON.stringify(topicInventory));
}