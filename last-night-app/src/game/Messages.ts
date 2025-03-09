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

import _messageChainRequestData from "../data/MessageChainRequestData.json";
const messageChainRequestData: MessageChainRequest[] = _messageChainRequestData;
export type MessageChainRequest = {
    topicIds: string[],
    userId: string,
    requiredFlags: string[],
    chainId?: string,
}

export function matchMessageChainRequest(request: MessageChainRequest, flags: string[]): MessageChainRequest | null {
    console.log(request, flags);
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
const topicData: Record<string, Topic> = _topicData;

export type TopicInventory = string[];

export type Topic = {
    id: string,
    category: string,
}

export function getDefaultTopicInventory(): TopicInventory {
    return [
        "debugTopic",
        "charKaytlyn",
        "charAngela",
        "charTim",
        "eggs"
    ];
}

export function getTopic(key: string) {
    const DEFAULT_KEY = "debugTopic";
    return topicData[key] ?? topicData[DEFAULT_KEY];
}

export function updateTopicInventory(G: GlobalSingleton, topicInventory: TopicInventory) {
    const [_, setTopicInventoryJSON] = G.topicInventoryJSON;
    setTopicInventoryJSON(JSON.stringify(topicInventory));
}