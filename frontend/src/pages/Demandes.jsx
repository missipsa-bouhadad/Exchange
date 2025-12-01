import React, { useEffect, useState } from "react";
import axios from "axios";

const Demandes = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); 

  const fetchChats = async () => {
    const { data } = await axios.get("http://localhost:8000/api/v1/chats", {
      withCredentials: true,
    });
    if (data.success) setChats(data.data);
  };

  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:8000/api/v1/user", {
      withCredentials: true,
    });
    if (data.success) setUsers(data.data);
  };

  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

  const handleCreateChat = async () => {
    if (!selectedUser) return alert("Veuillez choisir un utilisateur !");
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/chats",
      { otherUserId: selectedUser },
      { withCredentials: true }
    );
    if (data.success) {
      fetchChats(); 
      setSelectedUser(""); 
    }
  };

  return (
    <div>
      <h2>Demandes</h2>

      <h3>Créer une conversation</h3>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Choisissez un utilisateur</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.firstName} {u.lastName} ({u.email})
          </option>
        ))}
      </select>

      <button onClick={handleCreateChat}>Créer un chat</button>

      <hr />

      <h3>Vos conversations</h3>
      {chats.length === 0 ? (
        <p>Aucune conversation pour l’instant</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat._id}>
              <strong>{chat.chatName}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Demandes;
