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

const startIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke="currentColor"
  >
    <path d="M7.5 11.5v3M6 13h3m3-4.653c2.005 0 3.7-1.888 5.786-1.212 2.264.733 3.82 3.413 3.708 9.492-.022 1.224-.336 2.578-1.546 3.106-2.797 1.221-4.397-2.328-7-2.328h-1.897c-2.605 0-4.213 3.545-6.998 2.328-1.21-.528-1.525-1.882-1.547-3.107-.113-6.078 1.444-8.758 3.708-9.491C8.299 6.459 9.994 8.347 12 8.347m0-4.565v4.342M14.874 13h3" />
  </svg>
);

const playIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke="currentColor"
  >
    <path d="M14.581 9.402C16.194 10.718 17 11.375 17 12.5c0 1.125-.806 1.783-2.419 3.098a23.1 23.1 0 0 1-1.292.99c-.356.25-.759.508-1.176.762-1.609.978-2.413 1.467-3.134.926-.722-.542-.787-1.675-.918-3.943A32.48 32.48 0 0 1 8 12.5c0-.563.023-1.192.06-1.833.132-2.267.197-3.401.919-3.943.721-.541 1.525-.052 3.134.926.417.254.82.512 1.176.762a23.1 23.1 0 0 1 1.292.99" />
  </svg>
);

const pauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke="currentColor"
  >
    <path d="M9 6.5H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1m6.5 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1" />
  </svg>
);

// Variable to hold visemes outside the getter function
let visemes: string | null = null;

// Variable to hold mood outside the getter function
let mood: string | null = null;

// getter function to access visemes
export function getVisemes() {
  console.log("getting visemes");
  return visemes;
}

// getter function to access visemes
export function getMood() {
  console.log("getting mood");
  return mood;
}

const ChatScreen: React.FC = () => {
  // Set up websocket
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [playing, setPlaying] = useState(false);
  const [humanCharacter, setHumanCharacter] = useState("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const keepAliveInterval = 5000;

  const webSocketRef = useRef(socket);
  const playingRef = useRef(playing);

  useEffect(() => {
    webSocketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  type SpeechQueueItem = {
    characterName: string;
    audio: string; // Base64 of MP3
  };

  const speechQueue: SpeechQueueItem[] = [];

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
      console.log("hello");
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

  const playNextSpeech = () => {
    if (!speechQueue.length) return;
    const item = speechQueue[0];
    console.log(`Starting speech for ${item.characterName}`);

    const src = "data:audio/mp3;base64," + item.audio;
    const audio = new Audio(src);
    audio.onended = () => {
      speechQueue.shift();
      playNextSpeech();
    };
    audio.play();
    setAudio(audio);
  };

  // Function to handle inbound messages from the websocket
  function handleMessage(msg: string) {
    try {
      console.log("Handling message");
      const json = JSON.parse(msg);
      console.log("Got WS msg: " + JSON.stringify(json));

      try {
        if (json.action.who != "Human") {
          if (json.action.audio) {
            const item = {
              audio: json.action.audio,
              visemes: json.action.visemes,
              characterName: json.action.who,
              timedMtis: json.action.anim,
            };
            speechQueue.push(item);
            if (speechQueue.length === 1) playNextSpeech();
          }
        }
      } catch (e) {
        console.error(`Error with speech queue: ${e}`);
      }

      if (json.action.who === "Human") {
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

      mood = JSON.stringify(json.action?.mood);
      mood = mood.replace(/^"(.*)"$/, "$1");
      console.log("Got WS mood: " + mood);

      // Emit an event whenever visemes are updated
      visemesEmitter.emit("visemesUpdated", { visemes, mood });

      if (playingRef.current) tickScenario();
    } catch (e) {
      console.log(`Bad JSON: ${e}`);
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
              <button className="startScenario" onClick={() => startScenario()}>
                {startIcon}
              </button>
              <button className="playChat" onClick={() => playScenario()}>
                {playIcon}
              </button>
              <button className="pauseChat" onClick={() => stopScenario()}>
                {pauseIcon}
              </button>
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
