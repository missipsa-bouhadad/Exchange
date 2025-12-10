import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const NAVBAR_HEIGHT = 64;

const Demandes = () => {
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  //charger les chats
  const fetchChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/chats", {
        withCredentials: true,
      });

      if (data.success) {
        setChats(data.data);
        const chatId = searchParams.get("chatId");
        if (chatId) {
          const foundChat = data.data.find((chat) => chat._id === chatId);
          if (foundChat) {
            setSelectedChat(foundChat);
          }
        }
      }
    } catch (error) {
      console.error("Erreur fetch chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div
      className="relative flex bg-muted/20 overflow-hidden"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        marginTop: NAVBAR_HEIGHT,
      }}
    >
      <div className="border-r bg-white p-4 w-80">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold mx-auto">Conversations</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="flex flex-col gap-3">
            {chats.map((chat) => (
              <Card
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer hover:bg-accent ${
                  selectedChat?._id === chat._id ? "bg-accent" : ""
                }`}
              >
                <p className="font-medium">{chat.chatName}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col p-6">
        {!selectedChat ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Sélectionnez une conversation
          </div>
        ) : (
          <>
            <div className="border-b pb-3 mb-4">
              <h2 className="text-2xl font-semibold">
                {selectedChat.chatName}
              </h2>
            </div>

            <ScrollArea className="flex-1">
              <p className="text-muted">Messages ici…</p>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
              <Input placeholder="Écrire un message..." />
              <Button>Envoyer</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Demandes;
