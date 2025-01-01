import React, { FC } from "react";
const { useState } = React;
import './LoginScreen.css';

const LoginScreen: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // basic input validation, I can add more further down the line
        if (!email || !password) {
            setError("Both fields are required");
            return;
        }
        // currently no authentication is used - we need to implement with a backend
        setError("");
        console.log("Logging in with:", { email, password });

        const validateUser = async (email, password) => {
            const loginData = new URLSearchParams({
                username: email,
                password: password,
            });

            const response = await fetch(`https://studio.metaphysical.dev/agents/login`);

            try{
                const response = await fetch(`https://studio.metaphysical.dev/agents/login`, {
                        method: 'POST',
                        body: loginData,
                    });

                if (response.ok){
                    const json = await response.json();
                    if (json.success && json.jwt){
                        console.log('Login successful');
                        localStorage.setItem('JWT', json.jwt);
                    }
                }else{
                    console.error('Authentication of user failed');
                }
            }catch (e) {
                console.error(`Error in login validation: ${e}`);
            }
        }

        validateUser(email, password);
    };

    return (
        <>
            <div className={'welcomeheaderwrapper'}>
                <h1 className={'welcomeheader'}>Welcome to MetaPhysical</h1>
                <hr className={'headerunderline'} />
                <h2 className={'headersubheading'}>Please login or <a style={{textDecoration: 'underline'}} href={'/signup'}>Sign Up</a> to continue</h2>
            </div>
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={'login-input'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className={'login-input'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
        </>
    );
};

export default LoginScreen;
