import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

const UserChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatId = "66d35d1e00e2007dbfcb1272"; // แทนที่ด้วย chatId จริงๆ
  const sender = "user"; // กำหนดผู้ส่งเป็น user
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  // ฟังก์ชันในการดึงข้อมูลข้อความจากเซิร์ฟเวอร์
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

  useEffect(() => {
    fetchMessages();
  }, [chatId , messages]);

  useEffect(() => {
    // เชื่อมต่อกับ Socket.IO
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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
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
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div className={`flex flex-col max-w-[50%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap max-w-[50ch]">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
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
