import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    InputAdornment,
    Link,
    Alert,
    Divider,
    useTheme
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import theme from "../components/Theme";
import useAuth from "../hooks/useAuth";

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const muiTheme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Input validation
        if (!email || !password) {
            setError("Both email and password are required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Prepare login data
            const loginData = new URLSearchParams({
                username: email,
                password: password,
            });

            // Call the API
            // const response = await fetch("https://studio.metaphysical.dev/agents/login", {
            //     method: "POST",
            //     body: loginData,
            // });
            // actual validation has been suspended since the auth api doesn't work. Simulation purposes only for now.

            const response = new Promise(resolve => {
                setTimeout(() => {
                    // Simulating a successful login response
                    const dummyLoginData = {
                        success: true,
                        jwt: 'dummy.jwt.token', // Dummy JWT token
                        userId: '12345' // Dummy user ID
                    };

                    // Simulating a successful response
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(dummyLoginData)
                    });
                }, 2000); // resolves after 2 seconds
            });

            (async () => {
                try {
                    const res = await response;

                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.jwt) {
                            // Store JWT in localStorage
                            localStorage.setItem("JWT", data.jwt);

                            // Use our auth hook to update authentication state
                            login(data.jwt, data.userId || "user-id"); // Use actual userId if available

                            // Redirect to characters selection page
                            navigate("/");
                        } else {
                            setError("Login failed. Please check your credentials.");
                        }
                    } else {
                        setError("Authentication failed. Please try again.");
                    }
                } catch (error) {
                    setError("An error occurred during login.");
                }
            })();

        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred during login. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const goToSignUp = () => {
        navigate("/signup");
    };

    const goToHome = () => {
        navigate("/");
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                backgroundColor: "background.default",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Decorative background elements */}
                <Box sx={{
                    position: "absolute",
                    width: "50%",
                    height: "60%",
                    right: -100,
                    top: -100,
                    background: "radial-gradient(circle, rgba(58, 90, 217, 0.08) 0%, rgba(58, 90, 217, 0) 70%)",
                    borderRadius: "50%",
                    zIndex: 0,
                }} />

                <Box sx={{
                    position: "absolute",
                    width: "30%",
                    height: "40%",
                    left: -50,
                    bottom: -50,
                    background: "radial-gradient(circle, rgba(58, 90, 217, 0.05) 0%, rgba(58, 90, 217, 0) 70%)",
                    borderRadius: "50%",
                    zIndex: 0,
                }} />

                {/* Header */}
                <Container maxWidth="xl" sx={{ pt: 3, pb: 2, position: "relative", zIndex: 1 }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Box sx={{ cursor: "pointer" }} onClick={goToHome}>
                            <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
                                Metaphysical
                            </Typography>
                            <Box sx={{
                                height: 3,
                                width: 40,
                                bgcolor: "primary.main",
                                mt: 0.5
                            }} />
                            <Typography variant="subtitle1" color="text.secondary">
                                Studio
                            </Typography>
                        </Box>
                    </Box>
                </Container>

                {/* Login Content */}
                <Container
                    maxWidth="sm"
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 5,
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "primary.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3
                    }}>
                        <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    </Box>

                    <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
                        Welcome Back
                    </Typography>

                    <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                        Sign in to continue your conversations with extraordinary characters
                    </Typography>

                    <Card
                        sx={{
                            width: "100%",
                            border: "1px solid rgba(0,0,0,0.04)",
                            boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                            borderRadius: 3,
                            overflow: "visible",
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            {/* Display error if any */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Login Form */}
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    variant="outlined"
                                    margin="normal"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    variant="outlined"
                                    margin="normal"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2
                                        },
                                        mb: 1
                                    }}
                                />

                                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                                    <Link href="#" variant="body2" color="primary.main" underline="hover">
                                        Forgot password?
                                    </Link>
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<LoginIcon />}
                                    disabled={isLoading}
                                    sx={{
                                        borderRadius: 6,
                                        py: 1.5,
                                        mb: 2
                                    }}
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>

                            <Divider sx={{ my: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    OR
                                </Typography>
                            </Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                size="large"
                                onClick={goToSignUp}
                                sx={{
                                    borderRadius: 6,
                                    py: 1.5
                                }}
                            >
                                Create an Account
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Floating decorative elements */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "15%",
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
                        <EmailIcon color="primary" sx={{ fontSize: 25 }} />
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
                        <LockIcon color="primary" sx={{ fontSize: 20 }} />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default LoginScreen;