import React, { useState } from "react";
import "./SelectAiScreen.css";
import { useNavigate } from "react-router-dom";


const SelectAI: React.FC = () => {
  
    const navigate = useNavigate(); // Initialize navigation function

    const [isClicked, setIsClicked] = useState(false); // Use state to track clicks

    const [selectedAI, setSelectedAI] = useState(null);

    // Define the function to navigate to the chat screen
    const beginChatting = (AI_Name) =>{
        
        const name = AI_Name; // Set the AI name to the selected AI
        if (isClicked){
            const AI_ID = scenarioID[name]; // Set the scenario ID to Fred if Fred is selected
            localStorage.setItem('AI_ID', AI_ID); // Store the scenario ID in local storage
            navigate('/chat'); // Navigate to the chat screen when the button is pressed
        }  
    }


    // Handel click event
    const handleClick = (ai) => {
        setIsClicked(!isClicked);
        setSelectedAI(ai);
    }

    // Define scenario ID for each AI
    const scenarioID = {
        Fred: 166,
        Wade: 173
    }

    return (
        
        <div className="container">

            <div className="title">
                <span className="main-text">Metaphysical</span>
                <hr className="title_underline"></hr>
                <span className="sub-text">Studio</span>
            </div>
            
            <div className="ai_container">
                <div className={`select_ai ${selectedAI === 'Fred' ? "clicked" : "not_clicked"}`} 
                    onClick={() => handleClick('Fred')} onDoubleClick={() => beginChatting('Fred')}>
                    <img src="images/AI image.png" alt="AI image" className="ai_image"/>
                    <h1 className="name">Fred the pig farmer</h1>
                </div>

                <div className={`select_ai ${selectedAI === 'Wade' ? "clicked" : "not_clicked"}`} 
                    onClick={() => handleClick('Wade')} onDoubleClick={() => beginChatting('Wade')}>
                    <h1 className="name">Wade Smith the blacksmith</h1>
                </div>
            </div>
            <div className="overview_box">

                {isClicked && selectedAI == 'Fred' &&(
                    <>
                    <img src="images/AI image.png" alt="AI image" className="ai_image_overview"/>

                    <div className="ai_details">
                        <div className="ai_details_text">
                            <h1>Who am I?</h1>
                            <hr className="details_underline"></hr>
                            <br></br>
                            <p>Name: Fred the pig farmer</p>
                            <br></br>
                            <p>Age: 32</p>
                            <br></br>
                            <p>Gender: Male</p>
                            <br></br>
                            <p>Residence: Cornwall</p>
                        </div>
                    </div>

                    <div className="ai_description">
                        <div>
                            <h1>About me</h1>
                            <hr className="details_underline"></hr>
                            <br></br>
                            <p>Fred is a pig farmer by blood. His love for pig farming started at a very young age and it is all he had dedicated his life to. He can tell you anything you need to know about pigs.</p>
                        </div>
                    </div>

                    <button className="begin_button">Begin</button>
                    
                    </>
                )}

                {isClicked && selectedAI == 'Wade' &&(
                    <>
                        <img src="images/AI image.png" alt="AI image" className="ai_image_overview"/>

                        <div className="ai_details">
                            <div className="ai_details_text">
                                <h1>Who am I?</h1>
                                <hr className="details_underline"></hr>
                                <br></br>
                                <p>Name: Wade the BlackSmith</p>
                                <br></br>
                                <p>Age: 48</p>
                                <br></br>
                                <p>Gender: Male</p>
                                <br></br>
                                <p>Residence: London</p>
                            </div>
                        </div>

                        <div className="ai_description">
                            <div>
                                <h1>About me</h1>
                                <hr className="details_underline"></hr>
                                <br></br>
                                <p>Wade has been smithing since he was a young lad. His father made sure to teach him all the tricks he needs to make high quality products.</p>
                            </div>
                        </div>

                        <button className="begin_button">Begin</button>                 
                    </>
                )}

                {!isClicked && (
                    <>
                        <h1 className="welcome_text">Welcome to Metaphysical Studios' AI chat bot</h1>
                        <hr className="welcome_underline"></hr>
                        <p className="welcome_para">Select a range of different scenarios to talk to. We have made use of realistic models to provide and immersive realistic experience for our users. Select a scenario on the left and try it out!</p>
                    </>
                )}

            </div>

                
        </div>
  
  );
};

export default SelectAI;