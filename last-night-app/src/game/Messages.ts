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
}
export function getMessageChain(key: string): MessageChain {
    const DEFAULT_KEY = "debug.debugscene.0";
    return messageChainData[key] ?? messageChainData[DEFAULT_KEY];
}

import _userData from "../data/UserData.json";
import { GlobalSingleton } from "../GlobalContextHandler";
const userData: Record<string, User> = _userData;
export type User = {
    id: string;
    pfpUrl: string;
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

export function getDefaultMessageHistory(): MessageHistory {
    return [
        {
            userId: "debugShrek",
            messageChainIds: [
                "debug.debugscene.0"
            ],
        },
        {
            userId: "tim",
            messageChainIds: [
                "debug.debugscene.0"
            ],
        },
    ]
}

export function addChainMessageHistory(G: GlobalSingleton, chainId: string, userId: string) {
    const [messageHistory, _] = G.messageHistory;

    const userMessageHistory = messageHistory.filter((v) => v.userId === userId)[0];
    if (!userMessageHistory) return;

    userMessageHistory.messageChainIds.push(chainId);

    updateMessageHistory(G, messageHistory);
}

export function incrementShownMessagesMessageHistory(G: GlobalSingleton, addend: number, userId: string) {
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