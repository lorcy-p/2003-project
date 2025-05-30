import React, { FC, useEffect, useRef, useState } from "react";
import "./ChatScreen.css";
import { Loader, useTexture } from "@react-three/drei";
import { Leva } from "leva";
import { Canvas, useThree } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import visemesEmitter from "../components/visemeEvents";
import AudioRecorder from "../components/AudioRecorder";
import { useNavigate } from "react-router-dom";

import useSound from "use-sound";


import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Fade,
  useTheme,
  CircularProgress,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import theme from "../components/Theme";

// Define the structure of a message
interface Message {
  sender: string; // Who sent the message: "user" or "recipient"
  text: string; // The message content
  timestamp: string; // Time the message was sent
  attachment?: string; // Optional attachment (e.g., image URL)
}

const chatBoxIcon = (
  <svg
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="1.5"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title>cc [#ffffff]</title> <desc>Created with Sketch.</desc>{" "}
      <defs> </defs>{" "}
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        {" "}
        <g
          id="Dribbble-Light-Preview"
          transform="translate(-140.000000, -4039.000000)"
          fill="#ffffff"
        >
          {" "}
          <g id="icons" transform="translate(56.000000, 160.000000)">
            {" "}
            <path
              d="M100,3892 L100,3892 C100,3892.552 99.552,3893 99,3893 L97,3893 C95.895,3893 95,3892.105 95,3891 L95,3887 C95,3885.895 95.895,3885 97,3885 L99,3885 C99.552,3885 100,3885.448 100,3886 C100,3886.552 99.552,3887 99,3887 L98,3887 C97.448,3887 97,3887.448 97,3888 L97,3890 C97,3890.552 97.448,3891 98,3891 L99,3891 C99.552,3891 100,3891.448 100,3892 M93,3892 L93,3892 C93,3892.552 92.552,3893 92,3893 L90,3893 C88.895,3893 88,3892.105 88,3891 L88,3887 C88,3885.895 88.895,3885 90,3885 L92,3885 C92.552,3885 93,3885.448 93,3886 C93,3886.552 92.552,3887 92,3887 L91,3887 C90.448,3887 90,3887.448 90,3888 L90,3890 C90,3890.552 90.448,3891 91,3891 L92,3891 C92.552,3891 93,3891.448 93,3892 M101,3897 L87,3897 C86.448,3897 86,3896.552 86,3896 L86,3882 C86,3881.448 86.448,3881 87,3881 L101,3881 C101.552,3881 102,3881.448 102,3882 L102,3896 C102,3896.552 101.552,3897 101,3897 M84,3881 L84,3897 C84,3898.105 84.895,3899 86,3899 L102,3899 C103.105,3899 104,3898.105 104,3897 L104,3881 C104,3879.895 103.105,3879 102,3879 L86,3879 C84.895,3879 84,3879.895 84,3881"
              id="cc-[#ffffff]"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);

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

const hangUpIcon = (
  <svg
    fill="#ffffff"
    viewBox="0 0 24 24"
    id="hang-up"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#ffffff"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        id="primary"
        d="M5.68,15c-.54-.53-1.4-1.39-2.09-2.09a1.48,1.48,0,0,1,.16-2.28,13.61,13.61,0,0,1,16.63,0,1.48,1.48,0,0,1,.16,2.28L18.45,15a.75.75,0,0,1-1,.06,8.24,8.24,0,0,0-2.55-1.49.74.74,0,0,1-.45-.9l.2-.72A.78.78,0,0,0,14,11a10.44,10.44,0,0,0-3.94,0,.77.77,0,0,0-.6.95l.2.72a.74.74,0,0,1-.46.9,8.36,8.36,0,0,0-2.55,1.49A.74.74,0,0,1,5.68,15Z"
      ></path>
    </g>
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

// getter function to access mood
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
  const navigate = useNavigate();
  const keepAliveInterval = 5000;
  const muiTheme = useTheme();

  const webSocketRef = useRef(socket);
  const playingRef = useRef(playing);

  const [isOpen, setIsOpen] = useState(true); // Track collapse state

  // Get the current Scenario number
  const scenarioId = localStorage.getItem("AI_ID");
  const scenarioID = parseInt(scenarioId || "0");

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

  // Use Effect to connect to the websocket
  useEffect(() => {
    // If there are no current websocket connections establish a connection
    if (!webSocketRef.current) {
      start_ws(scenarioID);
    }

    // When the component unmounts close the connection
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, [scenarioID]); // Add scenarioID as a dependency

  // Keep websocket alive with a background empty request
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Keepalive");
      if (webSocketRef.current) webSocketRef.current.send("{}");
    }, keepAliveInterval);
    return () => clearInterval(interval);
  }, [socket]);

  // Start the websocket
  function start_ws(scenarioId = 0) {
    // Assign websocket instance to webSocketRef
    const ws = new WebSocket("wss://studio.metaphysical.dev/agents");
    webSocketRef.current = ws;

    // When the connection is opened play and tick the scenario to start communication
    ws.onopen = () => {
      connected(ws, scenarioId);
      setPlaying(true);
      tickScenario();
    };
    ws.onmessage = (e) => {
      handleMessage(e.data);
    };
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };
    ws.onclose = () => {
      console.log("WebSocket closed");
    };
  }

  // Stop the websocket
  function stop_ws(ws: WebSocket) {
    if (ws.readyState <= 1) ws.close();
    setSocket(null);
  }

  // State to store the list of messages
  const [messages, setMessages] = useState<Message[]>([]);

  //State to store wether threejs is loading the scene
  const [isLoading, setIsLoading] = useState(true);

  // State to handle the user's input
  const [newMessage, setNewMessage] = useState("");

  // Ref for scrolling to the bottom of the chat
  const messageScrollRef = useRef<HTMLDivElement>(null);

  // State to determine if AI is "typing"
  const [isTyping, setIsTyping] = useState(false);

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
      console.log(
        "Listeners before emit:",
        visemesEmitter.listeners("visemesUpdated").length
      );
      console.log(
        "Emitted:",
        visemesEmitter.emit("visemesUpdated", { visemes, mood })
      );

      visemesEmitter.emit("visemesUpdated", { visemes, mood });

      if (playingRef.current) tickScenario();
      //stop typing animation
      setIsTyping(false);
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
      //display typing animation
      setIsTyping(true);
    }
  };

  const LoadingOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "background.paper",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        transition: "opacity 0.5s ease-out",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 500,
          px: 4,
          animation: "fadeIn 0.5s ease-in",
          "@keyframes fadeIn": {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mb: 3,
            bgcolor: "primary.main",
            mx: "auto",
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
                boxShadow: "0 0 0 0 rgba(58, 90, 217, 0.4)",
              },
              "70%": {
                transform: "scale(1.05)",
                boxShadow: "0 0 0 10px rgba(58, 90, 217, 0)",
              },
              "100%": {
                transform: "scale(1)",
                boxShadow: "0 0 0 0 rgba(58, 90, 217, 0)",
              },
            },
          }}
        >
          <ChatIcon sx={{ fontSize: 60 }} />
        </Avatar>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "text.primary",
          }}
        >
          Preparing Your AI Session
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
          }}
        >
          Loading 3D environment and AI models...
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            mx: "auto",
            position: "relative",
            height: 8,
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "rgba(58, 90, 217, 0.1)",
            mb: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "100%",
              bgcolor: "primary.main",
              animation: "loadingBar 2s infinite ease-in-out",
              transformOrigin: "left center",
              "@keyframes loadingBar": {
                "0%": { transform: "scaleX(0)", opacity: 0.6 },
                "50%": { transform: "scaleX(1)", opacity: 1 },
                "100%": {
                  transform: "scaleX(0)",
                  opacity: 0.6,
                  transformOrigin: "right center",
                },
              },
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.disabled",
            fontStyle: "italic",
          }}
        >
          This may take a few moments...
        </Typography>
      </Box>
    </Box>
  );

  // declare the play and stop functions for each of the sounds
  const [play, { stop }] = useSound("/audio/dialling_tone.mp3");
  const [play1, { stop: stop1 }] = useSound("/audio/call_connected.mp3");

  // effect hook for the control of dialling and call connected sounds
  useEffect(() => {
    if (isLoading) {
      play();
    } else {
      stop();
      play1();
      setTimeout(() => {
        stop1();
      }, 1000);
    }
  }, [play, isLoading]);

  // Take audio input
  async function take_audio(base64: string) {
    console.log(`Got audio for ${humanCharacter} ${base64}`);

    // Create a temporary message while awaiting the response
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { sender: "user", text: "Processing...", timestamp: getCurrentTime() },
    // ]);

    const json = {
      type: "input",
      name: "Human",
      audio: base64,
    };

    webSocketRef.current && webSocketRef.current.send(JSON.stringify(json));

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: newMessage, timestamp: getCurrentTime() },
      ]);

      tickScenario();
    }, 2000);
  }

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
    start_ws(scenarioID);
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements similar to login/signup pages */}
        <Box
          sx={{
            position: "absolute",
            width: "50%",
            height: "60%",
            right: -100,
            top: -100,
            background:
              "radial-gradient(circle, rgba(58, 90, 217, 0.08) 0%, rgba(58, 90, 217, 0) 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: "30%",
            height: "40%",
            left: -50,
            bottom: -50,
            background:
              "radial-gradient(circle, rgba(58, 90, 217, 0.05) 0%, rgba(58, 90, 217, 0) 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <Container
          maxWidth="xl"
          sx={{ pt: 3, pb: 2, position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="bold"
                color="primary"
              >
                Metaphysical
              </Typography>
              <Box
                sx={{
                  height: 3,
                  width: 40,
                  bgcolor: "primary.main",
                  mt: 0.5,
                }}
              />
              <Typography variant="subtitle1" color="text.secondary">
                Studio
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* Canvas Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "60vh", md: "70vh" },
            zIndex: 1,
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 0, 1], fov: 30 }}
            
            
          >
            <Experience scenarioID={scenarioID} onReady={() => setIsLoading(false)}/>
          </Canvas>
          <canvas />
          {isLoading && <LoadingOverlay />}
          <Leva hidden={false} />
        </Box>

        {/* Chat Interface */}
        {!isLoading && (
          <Container
            maxWidth="lg"
            sx={{
              flex: 1,
              position: "relative",
              zIndex: 2,
              mt: isOpen ? -25 : -5,
              mb: 2,
            }}
          >
            <Card
              sx={{
                width: "100%",
                maxHeight: "50vh",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                borderRadius: 3,
                overflow: "visible",
                display: isOpen ? "flex" : "none",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  flex: 1,
                  overflowY: "auto",
                }}
                ref={messageScrollRef}
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    {message.sender === "recipient" && (
                      <Box sx={{ mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          fontWeight="bold"
                          sx={{ fontFamily: "'Corpos', sans-serif" }}
                        >
                          AI Model
                        </Typography>
                      </Box>
                    )}

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        maxWidth: "80%",
                        backgroundColor:
                          message.sender === "user"
                            ? "primary.main"
                            : "rgba(0,0,0,0.04)",
                        color:
                          message.sender === "user" ? "white" : "text.primary",
                        fontFamily:
                          message.sender === "recipient"
                            ? "'Corpos', sans-serif"
                            : "inherit",
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>

                      {message.attachment && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={message.attachment}
                            alt="attachment"
                            style={{ maxWidth: "100%", borderRadius: "8px" }}
                          />
                        </Box>
                      )}
                    </Paper>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {message.timestamp}
                    </Typography>

                    {message.sender === "recipient" && (
                      <Divider sx={{ width: "100%", my: 1.5 }} />
                    )}
                  </Box>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ mb: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        color="primary.main"
                        fontWeight="bold"
                        sx={{ fontFamily: "'Corpos', sans-serif" }}
                      >
                        AI Model
                      </Typography>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(0,0,0,0.04)",
                        fontFamily: "'Corpos', sans-serif",
                      }}
                    >
                      <Box
                        className="typing-ellipsis"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "& .dot": {
                            width: "8px",
                            height: "8px",
                            margin: "0 2px",
                            borderRadius: "50%",
                            backgroundColor: "text.secondary",
                            animation:
                              "typingAnimation 1.4s infinite ease-in-out",
                          },
                          "& .dot:nth-of-type(2)": {
                            animationDelay: "0.2s",
                          },
                          "& .dot:nth-of-type(3)": {
                            animationDelay: "0.4s",
                          },
                          "@keyframes typingAnimation": {
                            "0%, 100%": {
                              transform: "translateY(0)",
                            },
                            "50%": {
                              transform: "translateY(-5px)",
                            },
                          },
                        }}
                      >
                        <Box className="dot" />
                        <Box className="dot" />
                        <Box className="dot" />
                      </Box>
                    </Paper>
                  </Box>
                )}
              </CardContent>

              {/* Message Input Field */}
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Type message here..."
                  variant="outlined"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  InputProps={{
                    sx: {
                      borderRadius: 6,
                      pr: 1,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          color="primary"
                          sx={{ mr: -1 }}
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mr: 1 }}
                />

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AudioRecorder onAudioRecorded={take_audio} />
                </Box>
              </Box>
            </Card>

            {/* Control Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<ChatIcon />}
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                  borderRadius: 6,
                  px: 3,
                  boxShadow: "0 8px 16px rgba(58, 90, 217, 0.15)",
                }}
              >
                {isOpen ? "Hide Transcript" : "Show Transcript"}
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<CallEndIcon />}
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: 6,
                  px: 3,
                  boxShadow: "0 8px 16px rgba(211, 47, 47, 0.15)",
                }}
              >
                End Call
              </Button>
              <AudioRecorder onAudioRecorded={take_audio} />
            </Box>
          </Container>
        )}
        {/* Floating decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: "5%",
            width: 50,
            height: 50,
            borderRadius: "12px",
            bgcolor: "primary.light",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(58, 90, 217, 0.15)",
            transform: "rotate(10deg)",
            zIndex: 0,
          }}
        >
          <KeyboardVoiceIcon color="primary" sx={{ fontSize: 25 }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: "#ffffff",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
            transform: "rotate(-8deg)",
            zIndex: 0,
          }}
        >
          <ChatIcon color="primary" sx={{ fontSize: 20 }} />
        </Box>

        {/* Hidden Container for Leva and other technical components that need to remain in the DOM */}
        <Box sx={{ display: "none" }}>
          <div className="conversation">
            <div className="container-fluid">
              <div className="canvasContainer">
                {/* This is needed for compatibility but not shown to the user */}
              </div>
              <div className="chatWrapper">
                <div className={`card ${isOpen ? "open" : "collapsed"}`}>
                  {/* Hidden but preserved for component logic */}
                </div>
              </div>
              <div className="chatElements">
                <div
                  className={`inputContainer ${isOpen ? "open" : "collapsed"}`}
                ></div>
                <div className="buttonContainer"></div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatScreen;
