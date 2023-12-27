import { User } from "./UserType";

export type ChatType = {
    chatName: string;
    createdAt: string;
    groupAdmin: {
        _id: string;
    };
    isGroupChat: boolean;
    updatedAt: string;
    users: User[];
    _id: string;
}