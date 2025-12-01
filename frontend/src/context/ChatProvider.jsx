import { createContext, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ChatContext.Provider>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
