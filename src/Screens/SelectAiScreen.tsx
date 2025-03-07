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

                <div className={`select_ai ${isClicked? "clicked" : "not_clicked"}`} onClick={() => setIsClicked(!isClicked)} onDoubleClick={() => {setIsClicked(!isClicked); beginChatting();}}>
                    <img src="images/AI image.png" alt="AI image" className="ai_image"/>
                    <h1 className="name">Fred the pig farmer</h1>
                </div>

            </div>

            <div className="overview_box">

                {isClicked && (
                    <>
                    <img src="images/AI image.png" alt="AI image" className="ai_image_overview"/>

                    <div className="ai_details">
                        <div>
                            <p>Name: Fred the pig farmer</p>
                            <p>Age: 32</p>
                            <p>Residence: Cornwall</p>
                        </div>
                    </div>

                    <div className="ai_description">
                        <div>
                            <h1>Description:</h1>
                            <p>Fred is a pig farmer by blood. His love for pig farming started at a very young age and it is all he had dedicated his life to. He can tell you anything you need to know about pigs.</p>
                        </div>
                    </div>

                    <button className="begin_button">Begin</button>
                    
                    </>
                )}

                {!isClicked && (
                    <>
                        <h1 className="welcome_text">Welcome to Metaphysical Studios' AI chat bot</h1>

                        <p className="welcome_para">Select a range of different scenarios to talk to. We have made use of realistic models to provide and immersive realistic experience for our users. Select a scenario on the left and try it out!</p>
                    </>
                )}

            </div>

                
        </div>
  
  );
};

export default SelectAI;