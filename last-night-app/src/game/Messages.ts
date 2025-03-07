import _MessageData from "../data/MessageData.json";
const MessageData: Record<string, Message> = _MessageData;

export type Message = {
    id: string;
    senderId: string;
    isImage?: boolean;
    imgUrl?: string;
}

import _MessageChainData from "../data/MessageData.json";
const MessageChainData: Record<string, Message> = _MessageChainData;
export type MessageChain = {
    id: string;
    messageIds: string[]; // ids
}


export type User = {
    id: string;
    pfpUrl: string;
    isPlayer?: boolean;
}