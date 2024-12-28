import React, { FC } from "react";
import "./SelectAiScreen.css";
import { useNavigate } from "react-router-dom";

const SelectAI: React.FC = () => {
  
    const navigate = useNavigate(); // Initialize navigation function

    // Define the function to navigate to the chat screen
    const beginChatting = () =>{
        navigate('/chat'); // Navigate to the chat screen when the button is pressed
    }

    return (
    <div className="container">
        
        <div className="title">
            <span className="main-text">Metaphysical</span>
            <span className="sub-text">Studio</span>
        </div>
        <div className="ai_container">
            <h1 className="chatting_text">Start Chatting</h1>
            <div className="ai_selector_container">

                <div className="select_ai">

                </div>
                
            </div>
            <button className="begin_button" onClick={beginChatting}>Begin Chat</button>
        </div>
        
    </div>
  
  );
};

export default SelectAI;