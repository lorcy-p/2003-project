import React, { useState } from "react";
import "./SelectAiScreen.css";
import { useNavigate } from "react-router-dom";


const SelectAI: React.FC = () => {
  
    const navigate = useNavigate(); // Initialize navigation function

    const [isClicked, setIsClicked] = useState(false); // Use state to track clicks

    // Define the function to navigate to the chat screen
    const beginChatting = () =>{
        if (isClicked){
            navigate('/chat'); // Navigate to the chat screen when the button is pressed
        }  
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

                <div className={`select_ai ${isClicked? "clicked" : "not_clicked"}`} onClick={() => setIsClicked(!isClicked)}>

                    <img src="images/AI image.png" alt="AI image" className="ai_image"/>
                    <p className="ai_text">Talk with John. If you ever need a great mind to talk to John is your guy, he can provide you with a range of insight into different topics</p>
                </div>
                
            </div>
            <button className="begin_button" onClick={beginChatting}>Begin Chat</button>
        </div>
        
    </div>
  
  );
};

export default SelectAI;