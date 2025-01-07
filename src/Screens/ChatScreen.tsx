import React, { FC, useEffect, useRef, useState } from "react";
import "./ChatScreen.css";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";

// Define the structure of a message
interface Message {
  sender: string; // Who sent the message: "user" or "recipient"
  text: string;   // The message content
  timestamp: string; // Time the message was sent
  attachment?: string; // Optional attachment (e.g., image URL)
}

const ChatScreen: React.FC = () => {
  // State to store the list of messages
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

  // State to handle the user's input
  const [newMessage, setNewMessage] = useState("");

  // Ref for scrolling to the bottom of the chat
  const messageScrollRef = useRef<HTMLDivElement>(null);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      // Add the user's message and a bot response to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: newMessage, timestamp: getCurrentTime() },
        {
          sender: "recipient",
          text: "That is very interesting, tell me more",
          timestamp: getCurrentTime(),
        },
      ]);

      // Clear the input field
      setNewMessage("");
    }
  };

  // Function to get the current time in "HH:MM AM/PM" format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  };

  // Automatically scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (messageScrollRef.current) {
      messageScrollRef.current.scrollTop =
        messageScrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="conversation">
      <div className="container-fluid">
        <div className="card">
          {/* Scrollable container for messages */}
          <div
            className="messageScrollContainer"
            ref={messageScrollRef} // Attach ref for scrolling
          >
            <div className="messageContainer">
              {/* Loop through messages and display them */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender === "recipient"
                      ? "messageReceiver" // Styles for recipient's messages
                      : "messageSender" // Styles for user's messages
                  }`}
                >
                  {message.sender === "recipient" && (
                    <>
                      <div className="receiverName font-corpos">AI Model</div>
                      <div className="receiverMessage font-corpos">
                        {message.text}
                      </div>
                      {/* Display an attachment if available */}
                      {message.attachment && (
                        <div className="attachment">
                          <img src={message.attachment} alt="attachment" />
                        </div>
                      )}
                      <hr className="receiverHorizontalLine" />
                    </>
                  )}
                  {/* Display the message timestamp */}
                  <div
                    className={
                      message.sender === "recipient"
                        ? "timeReceiver" // Styles for recipient's timestamp
                        : "timeSender"   // Styles for user's timestamp
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

          {/* Input field for typing new messages */}
          <div className="inputContainer">
            <input
              id="icon"
              type="text"
              className="inputField"
              placeholder="Type message here..."
              value={newMessage} // Bind input value to state
              onChange={(e) => setNewMessage(e.target.value)} // Update state on input change
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Send message on Enter key press
            />
          </div>

          {/* Canvas for 3D experience */}
          <div className="canvasContainer">
            <Loader />
            <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
              <Experience />
            </Canvas>
          </div>

          {/* Leva UI controls */}
          <Leva hidden={false} />
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
