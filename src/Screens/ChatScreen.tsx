import React, { FC, useEffect, useRef, useState } from "react";
import "./ChatScreen.css";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import visemesEmitter from "../components/visemeEvents";

// Define the structure of a message
interface Message {
  sender: string; // Who sent the message: "user" or "recipient"
  text: string; // The message content
  timestamp: string; // Time the message was sent
  attachment?: string; // Optional attachment (e.g., image URL)
}



// Variable to hold visemes outside the getter function
let visemes: string | null = null;

// getter function to access visemes
export function getVisemes() {
  console.log("getting visemes")
  return visemes;
}

const ChatScreen: React.FC = () => {
  // Set up websocket
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [playing, setPlaying] = useState(false);
  const [humanCharacter, setHumanCharacter] = useState("");

  const keepAliveInterval = 5000;

  const webSocketRef = useRef(socket);
  const playingRef = useRef(playing);

  useEffect(() => {
    webSocketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Websocket is connected
  function connected(ws: WebSocket, scenarioId: number) {
    console.log(`Websocket connected, scenario ${scenarioId}`);
    const json = { type: "connect" };
    ws.send(JSON.stringify(json));

    if (scenarioId) {
      const json = { type: "start", scenario: scenarioId };
      ws.send(JSON.stringify(json));
    }
    setSocket(ws);
  }

  // Keep websocket alive with a background empty request
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Keepalive");
      if (webSocketRef.current) webSocketRef.current.send("{}");
    }, keepAliveInterval);
    return () => clearInterval(interval);
  }, [socket]);

  // Start the websocket
  function start_ws(scenarioId: number = 0) {
    // Create a websocket connection
    const ws = new WebSocket("wss://studio.metaphysical.dev/agents");

    // Set up event listeners
    ws.onopen = () => {
      connected(ws, scenarioId);
    };
    ws.onmessage = (e: MessageEvent) => {
      console.log("hello")
      handleMessage(e.data);
    };
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };
    ws.onclose = () => {
      console.log("WebSocket closed");
      stop_ws(ws);
    };

    // Clean up when the component unmounts
    return () => {
      ws.close();
    }; // Close websocket
  }

  // Stop the websocket
  function stop_ws(ws: WebSocket) {
    if (ws.readyState <= 1) ws.close();
    setSocket(null);
  }

  // State to store the list of messages
  const [messages, setMessages] = useState<Message[]>([]);

  // State to handle the user's input
  const [newMessage, setNewMessage] = useState("");

  // Ref for scrolling to the bottom of the chat
  const messageScrollRef = useRef<HTMLDivElement>(null);

  // Function to handle inbound messages from the websocket
  function handleMessage(msg: string) {
    try {
      const json = JSON.parse(msg);
      console.log("Got WS msg: " + JSON.stringify(json));

      if (json.action.who === "Human"){
        console.log("Ignore echo message");
        if (playingRef.current) tickScenario();
        return;
      }
      
      setMessages((messages) => [
        ...messages,
        {
          sender: "recipient",
          text: json.action?.say,
          timestamp: getCurrentTime(),
        },
      ]);

      // Update visemes
      visemes = JSON.stringify(json.action?.visemes);

      console.log("emitting")
      // Emit an event whenever visemes are updated
      visemesEmitter.emit("visemesUpdated", visemes);
      


      //console.log("Got WS msg: " + JSON.stringify(json.action?.anim));

      console.log("Got WS mood: " + JSON.stringify(json.action?.mood));

      if (playingRef.current) tickScenario();
    } catch (e) {
      console.log("Bad JSON");
    }
  }

  // Function to handle sending a message
  const handleSendMessage = () => {
    console.log(`Human input for ${"user"}: ${newMessage}`);

    // Send JSON data to the websocket
    const json = {
      type: "input",
      name: "Human", // Identify sender
      text: newMessage,
    };

    // Send the JSON
    webSocketRef.current && webSocketRef.current.send(JSON.stringify(json));

    if (newMessage.trim() !== "") {
      // Add the user's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: newMessage, timestamp: getCurrentTime() },
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

  // Functions to start and stop the scenarios
  function startScenario() {
    
    start_ws(166);

    setHumanCharacter("Human");
  }

  function stopScenario() {
    const json = { type: "stop" };
    webSocketRef.current && webSocketRef.current.send(JSON.stringify(json));
    webSocketRef.current && stop_ws(webSocketRef.current);
    setMessages([]);
    setPlaying(false);
  }

  // Start playing, continuous
  function playScenario() {
    setPlaying(true);
    tickScenario();
  }

  // Pause playing
  function pausesScenario() {
    setPlaying(false);
  }

  // Tick the scenario
  function tickScenario() {
    console.log("Tick");
    const json = { type: "tick" };
    webSocketRef.current && webSocketRef.current.send(JSON.stringify(json));
  }

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
                        : "timeSender" // Styles for user's timestamp
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

            <div className="buttonContainer">
              <button
                className="startScenario"
                onClick={() => startScenario()}
              />
              <button className="playChat" onClick={() => playScenario()} />
              <button className="pauseChat" onClick={() => stopScenario()} />
            </div>
          </div>

          {/* Leva UI controls */}
          <Leva hidden={false} />
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
