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
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [showUserPanel, setShowUserPanel] = useState(false);

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

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/user", {
        withCredentials: true,
      });
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error("Erreur fetch users:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

  const handleCreateChat = async (otherUserId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/chats",
        { otherUserId },
        { withCredentials: true }
      );

      if (data.success) {
        fetchChats();
        setSelectedChat(data.data);
        setShowUserPanel(false);
      }
    } catch (error) {
      console.error("Erreur création chat:", error);
    }
  };

  return (
    <div
      className="relative flex bg-muted/20 overflow-hidden"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        marginTop: NAVBAR_HEIGHT,
      }}
    >
      <div
        className={`
          absolute left-0 top-0 h-full w-80
          bg-white border-r p-4 z-40 shadow-lg
          transform transition-transform duration-300
          ${showUserPanel ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nouveau chat</h2>
          <Button variant="ghost" onClick={() => setShowUserPanel(false)}>
            ⟵
          </Button>
        </div>

        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-3">
            {users
              .filter((u) =>
                `${u.firstName} ${u.lastName} ${u.email}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((u) => (
                <Card
                  key={u._id}
                  onClick={() => handleCreateChat(u._id)}
                  className="p-3 cursor-pointer flex items-center gap-3 hover:bg-accent"
                >
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold uppercase">
                    {u.firstName[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </div>

      <div
        className={`
          border-r bg-white p-4 transition-all duration-300
          ${showUserPanel ? "ml-80 w-72" : "w-80"}
        `}
      >
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold mx-auto">Conversations</h2>

          {/*<Button
            variant="outline"
            size="sm"
            onClick={() => setShowUserPanel(true)}
          >
            🔍
          </Button>*/}
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
