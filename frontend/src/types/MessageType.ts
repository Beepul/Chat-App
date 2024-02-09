import { ChatType } from "./ChatType";
import { User } from "./UserType";

export type Message = {
    _id: string;
    content: string;
    chat: ChatType;
    readBy: User[];
    sender: {
        _id: string;
        name: string;
        pic: string;
        email: string;
    }
}