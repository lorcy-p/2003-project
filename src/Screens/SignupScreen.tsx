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
    useTheme,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import theme from "../components/Theme";

const SignupScreen: React.FC = () => {
    const navigate = useNavigate();
    const muiTheme = useTheme();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Input validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!agreeToTerms) {
            setError("You must agree to the Terms of Service and Privacy Policy");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Simulate API call for registration
            setIsLoading(true);
            setError("");

            // Create a promise that simulates an API response
            const response = await new Promise<{ok: boolean, json: () => Promise<any>}>(resolve => {
                setTimeout(() => {
                    // Simulating a successful registration response
                    const dummyRegisterData = {
                        success: true,
                        jwt: 'dummy.registration.token',
                        userId: 'new-user-12345'
                    };

                    // Simulating a successful response
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(dummyRegisterData)
                    });
                }, 2000); // resolves after 2 seconds
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.jwt) {
                    // Store JWT in localStorage
                    localStorage.setItem("JWT", data.jwt);

                    // Redirect to home page
                    navigate("/");
                } else {
                    setError("Registration failed. Please check your information and try again.");
                }
            } else {
                setError("Account creation failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("An error occurred during registration. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const goToLogin = () => {
        navigate("/login");
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
                    left: -100,
                    top: -100,
                    background: "radial-gradient(circle, rgba(58, 90, 217, 0.08) 0%, rgba(58, 90, 217, 0) 70%)",
                    borderRadius: "50%",
                    zIndex: 0,
                }} />

                <Box sx={{
                    position: "absolute",
                    width: "30%",
                    height: "40%",
                    right: -50,
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

                {/* Signup Content */}
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
                        <PersonAddIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    </Box>

                    <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
                        Create Account
                    </Typography>

                    <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                        Join the community and start conversing with extraordinary characters
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

                            {/* Signup Form */}
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    variant="outlined"
                                    margin="normal"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircleIcon color="action" />
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
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    variant="outlined"
                                    margin="normal"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        mb: 2
                                    }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={agreeToTerms}
                                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                                            required
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            I agree to the{" "}
                                            <Link href="#" color="primary" underline="hover">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="#" color="primary" underline="hover">
                                                Privacy Policy
                                            </Link>
                                        </Typography>
                                    }
                                    sx={{ mb: 2 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<PersonAddIcon />}
                                    disabled={isLoading}
                                    sx={{
                                        borderRadius: 6,
                                        py: 1.5,
                                        mb: 2
                                    }}
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
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
                                onClick={goToLogin}
                                sx={{
                                    borderRadius: 6,
                                    py: 1.5
                                }}
                            >
                                Sign In Instead
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Floating decorative elements */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "15%",
                            left: "5%",
                            width: 50,
                            height: 50,
                            borderRadius: "12px",
                            bgcolor: "primary.light",
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 20px rgba(58, 90, 217, 0.15)",
                            transform: "rotate(-10deg)",
                            zIndex: 0,
                        }}
                    >
                        <PersonIcon color="primary" sx={{ fontSize: 25 }} />
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "20%",
                            right: "5%",
                            width: 40,
                            height: 40,
                            borderRadius: "10px",
                            bgcolor: "#ffffff",
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                            transform: "rotate(8deg)",
                            zIndex: 0,
                        }}
                    >
                        <EmailIcon color="primary" sx={{ fontSize: 20 }} />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SignupScreen;