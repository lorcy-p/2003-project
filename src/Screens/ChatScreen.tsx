import React, { FC } from "react";

import { useState } from "react";
import "./ChatScreen.css";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  attachment?: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "recipient",
      text: "Demo text for now.",
      timestamp: "10:32 PM",
      attachment: "",
    },
    {
      sender: "user",
      text: "demo text for now",
      timestamp: "10:45 PM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { sender: "user", text: newMessage, timestamp: getCurrentTime() },
      ]);
      setNewMessage("");
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="conversation">
      <div className="container-fluid">
        <div className="card">
          <div className="messageScrollContainer">
            <div className="messageContainer">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender === "recipient"
                      ? "messageReceiver"
                      : "messageSender"
                  }`}
                >
                  {message.sender === "recipient" && (
                    <>
                      <div className="receiverName font-corpos">AI Model</div>
                      <div className="receiverMessage font-corpos">
                        {message.text}
                      </div>
                      {message.attachment && (
                        <div className="attachment">
                          <img src={message.attachment} alt="attachment" />
                        </div>
                      )}
                      <hr className="receiverHorizontalLine" />
                    </>
                  )}
                  <div
                    className={
                      message.sender === "recipient"
                        ? "timeReceiver"
                        : "timeSender"
                    }
                  >
                    {message.timestamp}
                  </div>
                  {message.sender === "user" && (
                    <div className="senderMessage">{message.text}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="inputContainer">
            <input
              id="icon"
              type="text"
              className="inputField"
              placeholder="Type message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <div className="canvasContainer">
            <Loader />
            <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
              <Experience />
            </Canvas>
          </div>
          <Leva hidden={false} />
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
