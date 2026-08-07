import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";


const NAVBAR_HEIGHT = 64;

const Demandes = () => {
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  //utilisateur connecté
  const currentUser = useSelector((state) => state.auth.user);

  //pour scroller en bas a chaque nouveau message 
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  //charger les chats
  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/chats", {
        withCredentials: true,
      });

      if (data.success) {
        setChats(data.data);
        // si chatId dans query string, on sélectionne ce chat
        const chatId = searchParams.get("chatId");
        if (chatId) {
          const foundChat = data.data.find((chat) => chat._id === chatId);
          if (foundChat) {
            setSelectedChat(foundChat);
          }
        }
      } else {
        setError("erreur récupération chats !");
      }
    } catch (err) {
      console.error("erreur", err);
      setError("erreur");
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  //charger les messages une fois un chat est selectionné
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) {
        setMessages([]);
        return;
      }
      setLoadingMessages(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/messages/${selectedChat._id}`,
          { withCredentials: true }
        );
        if (data.success) {
          setMessages(data.data);
          setTimeout(scrollToBottom, 50);
        } else {
          setError("Erreur récupération messages");
        }
      } catch (err) {
        console.error("Erreur fetch messages:", err);
        setError("Erreur fetch messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!selectedChat || !currentUser) return;
    if (newMessage.trim() === "") return;

    const payload = {
      chatId: selectedChat._id,
      content: newMessage.trim(),
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/messages",
        payload,
        { withCredentials: true }
      );

      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
        setTimeout(scrollToBottom, 50);
      } else {
        console.error("Envoi message: réponse inattendue", data);
      }
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  return (
    <div
      className="relative flex bg-mauve-clair/20 overflow-hidden"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        marginTop: NAVBAR_HEIGHT,
      }}
    >
      <div className="border-r border-mauve-clair bg-blanc p-4 w-80">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold mx-auto">Conversations</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="flex flex-col gap-3">
            {loadingChats ? (
              <div className="text-center py-6">chargement...</div>
            ) : chats.length === 0 ? (
              <div className="text-center py-6 text-mauve-fonce/70">
                aucune conversation
              </div>
            ) : (
              chats.map((chat) => (
                <Card
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`px-3 py-2 cursor-pointer border-mauve-clair shadow-none rounded-lg
    hover:bg-mauve-clair transition
    ${selectedChat?._id === chat._id ? "bg-mauve-clair" : ""}
  `}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate">
                      {chat.chatName}
                    </span>
                    <span className="text-xs text-mauve-fonce/70 truncate">
                      {chat.latestMessage
                        ? chat.latestMessage.sender?._id === currentUser._id
                          ? `Vous : ${chat.latestMessage.content}`
                          : chat.latestMessage.content
                        : "Aucun message"}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col p-6">
        {!selectedChat ? (
          <div className="h-full flex items-center justify-center text-mauve-fonce/70">
            selectionner une conversation
          </div>
        ) : (
          <>
            <div className="border-b border-mauve-clair pb-4 mb-4 space-y-1 text-center">
              <h2 className="text-2xl font-semibold">Conversation</h2>

              <div className="bg-mauve-clair border border-mauve-clair rounded-xl p-4 shadow-sm text-left mx-auto max-w-2xl">
                <p className="text-sm text-mauve-fonce/70 tracking-wide font-semibold">
                  Description
                </p>
                <p className="text-mauve-fonce whitespace-pre-wrap mt-1">
                  {selectedChat.adDescription || "aucune description"}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 overflow-auto p-2">
              {loadingMessages ? (
                <div>chargement des messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-mauve-fonce/70">
                  commencer la conversation
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => {
                    const isMine = msg.sender?._id === currentUser?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`p-3 rounded-lg max-w-[70%] ${
                          isMine
                            ? "bg-mauve-fonce text-blanc self-end"
                            : "bg-mauve-clair text-mauve-fonce self-start"
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">
                          {msg.sender?.firstName || "Utilisateur"}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Écrire un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage}>Envoyer</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Demandes;
