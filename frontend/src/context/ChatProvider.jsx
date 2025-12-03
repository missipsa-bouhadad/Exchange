import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  // 1) On récupère l'utilisateur directement depuis Redux
  const user = useSelector((state) => state.auth.user);

  return (
    <ChatContext.Provider value={{ user }}>{children}</ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
