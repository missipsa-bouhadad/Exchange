import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Star, Send, MessageCircle, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import RatingModal from "@/components/ui/RatingModal";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);

  // pour scroller en bas a chaque nouveau message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // formater une date ("il y a 2 heures")
  const formatRelative = (dateString) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(parseISO(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return "";
    }
  };

  // récuperer l'autre participant du chat
  const getOtherUser = (chat) => {
    if (!chat?.users || !currentUser) return null;
    return chat.users.find((u) => u._id !== currentUser._id) || null;
  };

  // charger les chats
  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/chats", {
        withCredentials: true,
      });
      if (data.success) {
        setChats(data.data);
        const chatId = searchParams.get("chatId");
        if (chatId) {
          const foundChat = data.data.find((chat) => chat._id === chatId);
          if (foundChat) setSelectedChat(foundChat);
        }
      } else {
        setError("Erreur lors de la recuperation des chats");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur");
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
        setHasRated(false);
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
          setError("Erreur lors de la recuperation des messages");
        }
      } catch (err) {
        console.error("Erreur fetch messages:", err);
        setError("Erreur lors de la recuperation des messages");
      } finally {
        setLoadingMessages(false);
      }

      if (selectedChat.request?._id) {
        try {
          const { data } = await axios.get(
            `http://localhost:8000/api/v1/ratings/request/${selectedChat.request._id}/me`,
            { withCredentials: true }
          );
          setHasRated(Boolean(data.data));
        } catch (err) {
          setHasRated(false);
        }
      } else {
        setHasRated(false);
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
        console.error("Envoi message: reponse inattendue", data);
      }
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  const getUnreadCount = (chat) => {
    if (!chat?.latestMessage) return 0;
    if (chat.latestMessage.sender?._id === currentUser?._id) return 0;
    return 1;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-blanc">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 items-start">
          {/* Sidebar */}
          <Card className="shadow-md rounded-xl overflow-hidden self-start">
            <div className="px-4 py-3 border-b border-mauve-clair ">
              <h2 className="text-sm font-semibold text-mauve-fonce uppercase tracking-wide">
                Conversations
              </h2>
            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-2">
              {loadingChats ? (
                <div className="text-center py-6 text-mauve-fonce/70 text-sm">
                  Chargement...
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-6 text-mauve-fonce/70 text-sm">
                  Aucune conversation
                </div>
              ) : (
                chats.map((chat) => {
                  const other = getOtherUser(chat);
                  const isSelected = selectedChat?._id === chat._id;
                  const unread = getUnreadCount(chat);
                  const lastActivity =
                    chat.latestMessage?.createdAt || chat.updatedAt;
                  return (
                    <button
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-mauve-clair/50"
                          : "hover:bg-mauve-clair/30"
                      }`}
                    >
                      <Avatar className="h-10 w-10 border border-mauve-clair">
                        <AvatarImage
                          src={other?.photoUrl || ""}
                          alt={other?.firstName || ""}
                        />
                        <AvatarFallback className="bg-mauve-clair text-mauve-fonce text-sm font-semibold">
                          {getInitials(other?.firstName || chat.chatName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`truncate text-sm ${
                              unread > 0
                                ? "font-bold text-mauve-fonce"
                                : "font-semibold text-mauve-fonce"
                            }`}
                          >
                            {chat.chatName}
                          </span>
                          {lastActivity && (
                            <span className="text-[10px] text-mauve-fonce/60 whitespace-nowrap flex-shrink-0">
                              {formatRelative(lastActivity)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span
                            className={`truncate text-xs ${
                              unread > 0
                                ? "text-mauve-fonce font-medium"
                                : "text-mauve-fonce/60"
                            }`}
                          >
                            {chat.latestMessage
                              ? chat.latestMessage.sender?._id === currentUser?._id
                                ? `Vous : ${chat.latestMessage.content}`
                                : chat.latestMessage.content
                              : "Aucun message"}
                          </span>
                          {unread > 0 && (
                            <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-mauve-fonce text-blanc text-[10px] font-bold">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          {/* Coversation */}
          <Card className="shadow-md rounded-xl overflow-hidden self-start">
            {!selectedChat ? (
              <div className="h-[70vh] flex flex-col items-center justify-center text-mauve-fonce/60 gap-3">
                <MessageCircle className="h-12 w-12" />
                <p className="text-sm">Selectionnez une conversation</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-5 py-3 border-b border-mauve-clair flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-mauve-clair">
                    <AvatarImage
                      src={getOtherUser(selectedChat)?.photoUrl || ""}
                      alt={getOtherUser(selectedChat)?.firstName || ""}
                    />
                    <AvatarFallback className="bg-mauve-clair text-mauve-fonce text-sm font-semibold">
                      {getInitials(
                        getOtherUser(selectedChat)?.firstName ||
                          selectedChat.chatName
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-left">
                    <h2 className="text-base font-semibold text-mauve-fonce truncate">
                      {selectedChat.chatName}
                    </h2>
                    {selectedChat.adTitle && (
                      <p className="text-xs text-mauve-fonce/70 truncate">
                        Echange : {selectedChat.adTitle}
                      </p>
                    )}
                  </div>

                  {selectedChat.request?.status === "ACCEPTED" && !hasRated && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setRatingOpen(true)}
                      className="flex items-center gap-1.5"
                    >
                      <Star className="w-4 h-4" /> Noter
                    </Button>
                  )}
                  {hasRated && (
                    <span className="text-xs text-mauve-fonce/60 italic">
                      Echange note
                    </span>
                  )}
                </div>

                {/* Description */}
                {selectedChat.adDescription && (
                  <div className="border-b border-mauve-clair px-5 py-2.5 text-left">
                    <p className="text-xs text-mauve-fonce leading-relaxed line-clamp-2">
                      <span className="font-semibold">Annonce : </span>
                      {selectedChat.adDescription}
                    </p>
                  </div>
                )}

                {/* Messages */}
                <div className="px-5 py-4 min-h-[40vh] max-h-[55vh] overflow-y-auto">
                  {loadingMessages ? (
                    <div className="text-center text-sm text-mauve-fonce/70 py-8">
                      Chargement des messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-mauve-fonce/60 py-8">
                      Commencez la conversation
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {messages.map((msg) => {
                        const isMine = msg.sender?._id === currentUser?._id;
                        return (
                          <div
                            key={msg._id}
                            className={`flex items-end gap-2 ${
                              isMine ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {!isMine && (
                              <Avatar className="h-7 w-7 border border-mauve-clair flex-shrink-0">
                                <AvatarImage
                                  src={msg.sender?.photoUrl || ""}
                                  alt={msg.sender?.firstName || ""}
                                />
                                <AvatarFallback className="bg-mauve-clair text-mauve-fonce text-[10px] font-semibold">
                                  {getInitials(msg.sender?.firstName)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`max-w-[70%] px-3.5 py-2 rounded-2xl shadow-sm ${
                                isMine
                                  ? "bg-mauve-fonce text-blanc rounded-br-sm"
                                  : "bg-blanc text-mauve-fonce border border-mauve-clair rounded-bl-sm"
                              }`}
                            >
                              {!isMine && (
                                <div className="text-[11px] font-semibold mb-0.5 text-mauve-fonce/80">
                                  {msg.sender?.firstName || "Utilisateur"}
                                </div>
                              )}
                              <div className="text-sm whitespace-pre-wrap break-words">
                                {msg.content}
                              </div>
                              <div
                                className={`flex items-center gap-1 text-[10px] mt-1 ${
                                  isMine
                                    ? "text-blanc/70 justify-end"
                                    : "text-mauve-fonce/50 justify-start"
                                }`}
                              >
                                <span>{formatRelative(msg.createdAt)}</span>
                                {isMine &&
                                  (msg.readBy?.length > 0 ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="border-t border-mauve-clair px-5 py-3 flex gap-2">
                  <Input
                    placeholder="Ecrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 bg-blanc"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={newMessage.trim() === ""}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Envoyer</span>
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      <RatingModal
        open={ratingOpen}
        onOpenChange={setRatingOpen}
        requestId={selectedChat?.request?._id}
        onSuccess={() => setHasRated(true)}
      />
    </div>
  );
};

export default Messages;
