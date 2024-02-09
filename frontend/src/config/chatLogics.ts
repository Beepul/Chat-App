import { Message } from "../types/MessageType";
import { User } from "../types/UserType";

// getSender -> getSenderName
export const getSenderName = (loggedUser: User | null, users: User[]) => {
    return users[0]._id === loggedUser?._id ? users[1].name : users[0].name
}

// getFullSender
export const getFullSender = (loggedUser: User | null, users: User[]) => {
    return users[0]._id === loggedUser?._id ? users[1] : users[0]
}

// check is sender who send current message and the previous message is same or not 
// and also if current message is not logged in user
// returns boolean
export const isSameSender = (messages:Message[], m:Message, i: number, userId: string | undefined) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
};

// check if its last message from a user or not and check if last message is not loggedin user
// return boolean
export const isLastMessage = (messages: Message[], i: number, userId: string | undefined) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
};

// if same sender of a sequence of message return 33 margin for style
// else 0 margin
export const isSameSenderMargin = (messages: Message[], m: Message, i: number, userId: string | undefined) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
};

export const isSameUser = (messages: Message[], m: Message, i: number) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };