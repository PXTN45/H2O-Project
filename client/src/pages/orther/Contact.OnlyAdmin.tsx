import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  userId: {
    name: string;
    image?: string;
  };
  businessId?: {
    businessName: string;
    image?: string;
  };
  lastMessage: string;
  adminId?: string;
  messages: Message[];
}

const AdminChat: React.FC = () => {
  const [unassignedChats, setUnassignedChats] = useState<Chat[]>([]);
  const [assignedChats, setAssignedChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeTab, setActiveTab] = useState<"unassigned" | "assigned">(
    "unassigned"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // ใช้ newSocket แทน socket จาก state
    };
  }, []);

  useEffect(() => {
    fetchChats();

    if (socket && activeChat) {
      socket.emit("joinChat", activeChat._id);

      socket.on("message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket, activeChat]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
    }
  }, [activeChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/help/chats");
      const chats = response.data;

      const updatedChats = chats.map((chat: Chat) => {
        const latestMessage = chat.messages[chat.messages.length - 1];
        return {
          ...chat,
          lastMessage: latestMessage
            ? `${latestMessage.sender}: ${latestMessage.content}`
            : "No messages",
          lastSender: latestMessage ? latestMessage.sender : "",
        };
      });

      setUnassignedChats(updatedChats.filter((chat: Chat) => !chat.adminId));
      setAssignedChats(updatedChats.filter((chat: Chat) => chat.adminId));
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get<Message[]>(
        "http://localhost:3000/help/messages",
        {
          params: { chatId: activeChat?._id },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChat) return;

    try {
      const newMessage: Message = {
        sender: "Admin",
        content: inputValue,
        timestamp: new Date().toISOString(),
      };

      await axios.post("http://localhost:3000/help/send", {
        chatId: activeChat._id,
        ...newMessage,
      });

      setMessages([...messages, newMessage]);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAssignChat = async (chat: Chat) => {
    // Check if the chat is already assigned
    if (chat.adminId) {
      Swal.fire({
        title: "Already Assigned",
        text: "This chat is already assigned to another admin.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    // Check how many chats are assigned to this admin
    try {
      const response = await axios.get("http://localhost:3000/help/chats");
      const assignedChats = response.data;

      const assignedCount = assignedChats.filter(
        (assignedChat: Chat) =>
          assignedChat.adminId === "668f0a1531ff843f51f1855b"
      ).length;

      if (assignedCount >= 5) {
        // Adjust the number according to your requirement
        Swal.fire({
          title: "Limit Exceeded",
          text: "You cannot assign more than one chat at a time.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      // Proceed with assigning the chat
      await axios.post("http://localhost:3000/help/assign", {
        chatId: chat._id,
        adminId: "668f0a1531ff843f51f1855b", // ใส่ admin id ของคุณที่นี่
      });

      fetchChats(); // รีเฟรชรายชื่อแชทหลังจาก assign

      Swal.fire({
        title: "Success",
        text: "You have been assigned to handle this chat.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error checking assigned chats:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error assigning the chat.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-[88vh] flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 md:border-r-0 md:border-b">
        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 py-3 px-6 text-lg font-semibold ${
              activeTab === "unassigned"
                ? "text-blue-500 border-b-4 border-blue-500"
                : "text-gray-500 bg-gray-50"
            }`}
            onClick={() => setActiveTab("unassigned")}
          >
            Unassigned Chats
          </button>
          <button
            className={`w-1/2 py-3 px-6 text-lg font-semibold ${
              activeTab === "assigned"
                ? "text-blue-500 border-b-4 border-blue-500"
                : "text-gray-500 bg-gray-50"
            }`}
            onClick={() => setActiveTab("assigned")}
          >
            Assigned Chats
          </button>
        </div>
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-70px)]">
          {(activeTab === "unassigned" ? unassignedChats : assignedChats).map(
            (chat) => (
              <div
                key={chat._id}
                className={`p-4 border rounded cursor-pointer ${
                  activeChat?._id === chat._id ? "bg-gray-300" : "bg-white"
                } flex items-center`}
                onClick={() => {
                  if (activeTab === "unassigned") {
                    handleAssignChat(chat);
                  } else {
                    setActiveChat(chat);
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={chat.userId?.image || chat.businessId?.image}
                    alt={chat.userId?.name || chat.businessId?.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    {chat.userId?.name || chat.businessId?.businessName}
                  </p>
                  <p className="text-sm text-gray-600 truncate max-w-[20ch]">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            )
          )}
        </ul>
      </div>

      <div className="w-full md:w-2/3 bg-gray-50 flex flex-col">
        {activeChat ? (
          <>
            <h2 className="text-2xl font-bold mb-4 p-4 bg-white">
              Chat with{" "}
              {activeChat.userId?.name ||
                activeChat.businessId?.businessName ||
                "No users"}
            </h2>
            <div className="flex-1 overflow-y-auto bg-white border rounded p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.sender === "Admin" ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`inline-block px-4 py-2 rounded-lg break-words whitespace-pre-wrap max-w-[50ch] ${
                      message.sender === "Admin"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex p-4 bg-white border-t">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                className="flex-1 border rounded-lg py-2 px-4"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
