import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/auth.provider";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface Chat {
  _id: string;
  userId?: { _id: string };
  businessId?: { _id: string };
}

const UserChat: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const sender = userInfo?.name || userInfo?.businessName || "User";
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/help/messages?chatId=${chatId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };
  const fetchChats = async () => {
    try {
      const response = await axios.get<Chat[]>(
        `http://localhost:3000/help/chats`
      );
      const filteredChats = response.data.filter((chat: Chat) => {
        return (
          chat.userId?._id === userInfo?._id ||
          chat.businessId?._id === userInfo?._id
        );
      });
      if (filteredChats.length > 0) {
        setChatId(filteredChats[0]._id);
      } else {
        const id: { userId?: string; businessId?: string } = {};

        if (userInfo?.role === "user") {
          id.userId = userInfo._id;
        } else if (userInfo?.role === "business") {
          id.businessId = userInfo._id;
        }

        const createResponse = await axios.post(
          `http://localhost:3000/help/create`,
          id
        );
        setChatId(createResponse.data._id); // อัปเดต chatId เป็น ID ของแชทที่ถูกสร้างใหม่
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chatId !== "") {
      fetchMessages();
    } else {
      return;
    }
  }, [chatId, messages]);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.emit("joinChat", chatId);

    socket.on("message", (newMessage: Message) => {
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    if (!userIsScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, userIsScrolling]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      sender,
      content: inputValue,
      timestamp: new Date(),
    };

    // อัปเดตสถานะ messages ทันที
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await axios.post("http://localhost:3000/help/send", {
        chatId,
        sender,
        content: inputValue,
      });
      setInputValue(""); // เคลียร์ช่องข้อความหลังจากส่งข้อความ
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setUserIsScrolling(scrollTop + clientHeight < scrollHeight);
    }
  };

  return (
    <div className="flex flex-col h-[88vh] p-4 bg-gray-100">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((message, index) => {
            const isSender =
              message.sender === userInfo?.name ||
              message.sender === userInfo?.businessName;

            return (
              <div
                key={index}
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`flex flex-col max-w-[50%] ${
                    isSender ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSender
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap max-w-[30ch]">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default UserChat;
