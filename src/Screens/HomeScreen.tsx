import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import theme from "../components/Theme";
import characters from "../data/characters";
import useAuth from "../hooks/useAuth";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Featured characters data - matches your SelectAI screen format
const featuredCharacters = characters.slice(0, 3); // Only show 3 featured characters

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userToken, logout } = useAuth();

    // Refs for GSAP animations
    const headerRef = useRef(null);
    const heroRef = useRef(null);
    const charactersRef = useRef(null);
    const featuresRef = useRef(null);
    const searchRef = useRef(null);
    const ctaButtonsRef = useRef(null);

    // User menu state
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleUserMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    // Navigation functions
    const goToSelectAI = () => {
        if (isAuthenticated) {
            navigate("/characters");
        } else {
            navigate("/login", { state: { from: "/characters" } });
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const goToLogin = () => {
        navigate("/login");
    };

    const goToSignup = () => {
        navigate("/signup");
    };

    const handleLogout = () => {
        logout();
        handleUserMenuClose();
        // Optional: Show a toast notification that logout was successful
    };

    // Navigate to specific character
    const startWithCharacter = (characterId: number) => {
        if (isAuthenticated) {
            localStorage.setItem('AI_ID', characterId.toString());
            navigate('/chat');
        } else {
            // Save the intended destination
            localStorage.setItem('intended_character', characterId.toString());
            navigate('/login', { state: { from: "/chat" } });
        }
    };

    // Initialize animations
    useEffect(() => {
        // Initial animation timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Header animation
        tl.fromTo(
            headerRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }
        );

        // Hero section staggered animation
        tl.fromTo(
            heroRef.current.querySelectorAll('.hero-element'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 },
            "-=0.3"
        );

        // Search bar appear with slight bounce
        if (searchRef.current) {
            tl.fromTo(
                searchRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
                "-=0.2"
            );
        }

        // CTA buttons animation
        if (ctaButtonsRef.current) {
            tl.fromTo(
                ctaButtonsRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
                "-=0.3"
            );
        }

        // Characters scroll-triggered animation
        gsap.fromTo(
            charactersRef.current.children,
            {
                y: 30,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.12,
                duration: 0.6,
                scrollTrigger: {
                    trigger: charactersRef.current,
                    start: "top 75%",
                }
            }
        );

        // Subtle continuous animation for featured characters (floating effect)
        charactersRef.current.querySelectorAll('.character-card').forEach((card, index) => {
            gsap.to(card, {
                y: "6px",
                duration: 2.5 + (index * 0.2),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        // Features section animation with icons appearing first
        const featureItems = featuresRef.current.querySelectorAll('.feature-item');
        featureItems.forEach((item) => {
            const icon = item.querySelector('.feature-icon');
            const content = item.querySelector('.feature-content');

            const featureTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                }
            });

            featureTl
                .fromTo(icon, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" })
                .fromTo(content, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, "-=0.2");
        });

        // Clean up ScrollTrigger on component unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                bgcolor: "background.default",
                minHeight: "100vh",
                overflow: "hidden"
            }}>
                {/* Header */}
                <Container maxWidth="xl" sx={{ pt: 3, pb: 2 }} ref={headerRef}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
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

                        {/* Right side navigation - conditionally rendered based on auth state */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<ChatIcon />}
                                        onClick={goToSelectAI}
                                        size="small"
                                        sx={{
                                            borderRadius: 6,
                                            display: { xs: "none", md: "flex" }
                                        }}
                                    >
                                        My Characters
                                    </Button>

                                    <Box>
                                        <IconButton
                                            onClick={handleUserMenuClick}
                                            size="small"
                                            sx={{ ml: 1 }}
                                            aria-controls={open ? "user-menu" : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? "true" : undefined}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: "primary.main"
                                                }}
                                            >
                                                <PersonIcon />
                                            </Avatar>
                                            <KeyboardArrowDownIcon
                                                fontSize="small"
                                                sx={{
                                                    ml: 0.5,
                                                    color: "text.secondary"
                                                }}
                                            />
                                        </IconButton>
                                        <Menu
                                            id="user-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleUserMenuClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'user-button',
                                            }}
                                            PaperProps={{
                                                elevation: 3,
                                                sx: {
                                                    borderRadius: 2,
                                                    mt: 1.5,
                                                    minWidth: 180,
                                                    overflow: 'visible',
                                                    '&:before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 20,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: 'background.paper',
                                                        transform: 'translateY(-50%) rotate(45deg)',
                                                        zIndex: 0,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <MenuItem onClick={() => {
                                                handleUserMenuClose();
                                                navigate("/profile");
                                            }}>
                                                <AccountCircleIcon fontSize="small" sx={{ mr: 1.5 }} />
                                                Profile
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                handleUserMenuClose();
                                                navigate("/characters");
                                            }}>
                                                <ChatIcon fontSize="small" sx={{ mr: 1.5 }} />
                                                My Characters
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem onClick={handleLogout}>
                                                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </>
                            ) : (
                                <Box ref={ctaButtonsRef} sx={{ display: "flex", gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={goToSignup}
                                        sx={{
                                            borderRadius: 6,
                                            display: { xs: "none", sm: "block" }
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<LoginIcon />}
                                        onClick={goToLogin}
                                        sx={{ borderRadius: 6 }}
                                    >
                                        Login
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Container>

                {/* Hero Section */}
                <Box
                    sx={{
                        pt: { xs: 4, md: 8 },
                        pb: { xs: 8, md: 10 },
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
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

                    <Container maxWidth="xl">
                        <Grid container spacing={4} alignItems="center" ref={heroRef}>
                            {/* Hero Content */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h2"
                                    component="h2"
                                    fontWeight="bold"
                                    className="hero-element"
                                    sx={{
                                        mb: 3,
                                        fontSize: { xs: "2rem", md: "3rem" },
                                        maxWidth: "90%"
                                    }}
                                >
                                    Converse with{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            color: "primary.main",
                                            position: "relative",
                                            "&::after": {
                                                content: '""',
                                                position: "absolute",
                                                width: "100%",
                                                height: "5px",
                                                bottom: "5px",
                                                left: 0,
                                                backgroundColor: "primary.light",
                                                zIndex: -1,
                                            }
                                        }}
                                    >
                                        extraordinary
                                    </Box>
                                    {" "}characters
                                </Typography>

                                <Typography
                                    variant="body1"
                                    className="hero-element"
                                    sx={{
                                        mb: 4,
                                        color: "text.secondary",
                                        fontSize: { xs: "1rem", md: "1.1rem" },
                                        maxWidth: "85%"
                                    }}
                                >
                                    Experience immersive conversations with unique AI characters,
                                    each with their own history, expertise, and perspective.
                                </Typography>

                                <Box className="hero-element" sx={{ display: "flex", gap: 2, mb: 5 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        endIcon={<ChevronRightIcon />}
                                        onClick={goToSelectAI}
                                        sx={{
                                            borderRadius: 6,
                                            px: 3,
                                            py: 1.5,
                                        }}
                                    >
                                        {isAuthenticated ? "Explore Characters" : "Get Started"}
                                    </Button>

                                    {!isAuthenticated && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                            onClick={goToLogin}
                                            sx={{
                                                borderRadius: 6,
                                                px: 3,
                                                py: 1.5,
                                            }}
                                        >
                                            Learn More
                                        </Button>
                                    )}
                                </Box>

                                {/* Auth Status Indication */}
                                {isAuthenticated && (
                                    <Box
                                        className="hero-element"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            bgcolor: "primary.light",
                                            p: 1.5,
                                            borderRadius: 2,
                                            width: "fit-content"
                                        }}
                                    >
                                        <ChatIcon color="primary" fontSize="small" />
                                        <Typography variant="body2" color="primary.dark">
                                            You're logged in and ready to start conversations!
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>

                            {/* Hero Image/Featured Character */}
                            <Grid item xs={12} md={6}>
                                <Box
                                    className="hero-element"
                                    sx={{
                                        position: "relative",
                                        height: { xs: 350, md: 430 },
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Card
                                        sx={{
                                            width: "100%",
                                            maxWidth: 500,
                                            mx: "auto",
                                            overflow: "visible",
                                            border: "1px solid rgba(0,0,0,0.04)",
                                            boxShadow: "0 30px 60px -10px rgba(58, 90, 217, 0.25), 0 10px 20px -10px rgba(0, 0, 0, 0.08)",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image="/images/AI image.png"
                                            alt="Featured AI character"
                                            height={230}
                                            sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)", borderRadius: '7px' }}
                                        />
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                                                Start a conversation
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Select a character and begin exploring their unique knowledge and perspective.
                                            </Typography>

                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                                <Chip
                                                    label={`${characters.length} available`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    endIcon={<ChevronRightIcon />}
                                                    onClick={goToSelectAI}
                                                >
                                                    View all
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    {/* Floating decorative elements */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: { xs: -15, md: -30 },
                                            right: { xs: "15%", md: "5%" },
                                            width: 60,
                                            height: 60,
                                            borderRadius: "12px",
                                            bgcolor: "primary.light",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 8px 20px rgba(58, 90, 217, 0.15)",
                                            transform: "rotate(10deg)",
                                            zIndex: 1,
                                        }}
                                        className="floating-element"
                                    >
                                        <PersonIcon color="primary" sx={{ fontSize: 30 }} />
                                    </Box>

                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: { xs: -15, md: -25 },
                                            left: { xs: "10%", md: "20%" },
                                            width: 50,
                                            height: 50,
                                            borderRadius: "12px",
                                            bgcolor: "#ffffff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                                            transform: "rotate(-8deg)",
                                            zIndex: 1,
                                        }}
                                        className="floating-element"
                                    >
                                        <ChatIcon color="primary" sx={{ fontSize: 25 }} />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Featured Characters Section */}
                <Box sx={{ pt: 3, pb: 8, bgcolor: "background.paper" }}>
                    <Container maxWidth="xl">
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 4
                            }}
                        >
                            <Typography variant="h5" component="h2" fontWeight="bold">
                                Featured Characters
                            </Typography>

                            <Button
                                variant="text"
                                color="primary"
                                endIcon={<ChevronRightIcon />}
                                onClick={goToSelectAI}
                            >
                                View all
                            </Button>
                        </Box>

                        <Box
                            ref={charactersRef}
                            sx={{
                                display: "grid",
                                gap: 3,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                    md: "1fr 1fr 1fr"
                                }
                            }}
                        >
                            {featuredCharacters.map((character) => (
                                <Box
                                    key={character.id}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 2,
                                        transition: "all 0.2s ease",
                                        border: "1px solid rgba(0,0,0,0.04)",
                                        cursor: "pointer",
                                        "&:hover": {
                                            transform: "translateY(-8px)",
                                            boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                                        }
                                    }}
                                    onClick={() => startWithCharacter(character.id)}
                                    className="character-card"
                                >
                                    <CardMedia
                                        component="img"
                                        height={180}
                                        image={character.imagePath}
                                        alt={character.name}
                                    />
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {character.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                height: 40
                                            }}
                                        >
                                            {character.shortDescription}
                                        </Typography>

                                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                            <Chip
                                                label={character.residence}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: "0.75rem",
                                                    bgcolor: "background.default"
                                                }}
                                            />
                                            <Chip
                                                label={`Age: ${character.age}`}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: "0.75rem",
                                                    bgcolor: "background.default"
                                                }}
                                            />
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            startIcon={<ChatIcon />}
                                            size="small"
                                            sx={{ borderRadius: 6 }}
                                        >
                                            Start Conversation
                                        </Button>
                                    </CardContent>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>


                {/* Features Section */}
                <Box sx={{ py: 8, bgcolor: "background.default" }}>
                    <Container maxWidth="xl">
                        <Typography
                            variant="h4"
                            component="h2"
                            fontWeight="bold"
                            align="center"
                            sx={{ mb: 1 }}
                        >
                            Welcome to Metaphysical Studio
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                            sx={{
                                mb: 6,
                                maxWidth: 700,
                                mx: "auto"
                            }}
                        >
                            Select a character from our collection to begin an immersive conversation experience.
                            Each character has unique knowledge and background to explore.
                        </Typography>

                        <Grid container spacing={3} ref={featuresRef}>
                            {[
                                {
                                    icon: <PersonIcon />,
                                    title: "Diverse Characters",
                                    description: "Explore a range of unique personalities"
                                },
                                {
                                    icon: <ChatIcon />,
                                    title: "Natural Conversations",
                                    description: "Engage in realistic dialogues"
                                },
                                {
                                    icon: <HistoryEduIcon />,
                                    title: "Authentic Knowledge",
                                    description: "Learn from detailed subject expertise"
                                },
                                {
                                    icon: <LocationOnIcon />,
                                    title: "Cultural Immersion",
                                    description: "Experience different perspectives"
                                }
                            ].map((feature, index) => (
                                <Grid item xs={12} sm={6} key={index} className="feature-item">
                                    <Box sx={{
                                        p: 3,
                                        border: "1px solid rgba(0,0,0,0.08)",
                                        borderRadius: 2,
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        bgcolor: "background.paper"
                                    }}>
                                        <Box
                                            className="feature-icon"
                                            sx={{
                                                color: "primary.main",
                                                bgcolor: "primary.light",
                                                borderRadius: 2,
                                                p: 1.5,
                                                mr: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Box className="feature-content">
                                            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ textAlign: "center", mt: 5 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={isAuthenticated ? <ChevronRightIcon /> : <LoginIcon />}
                                onClick={isAuthenticated ? goToSelectAI : goToLogin}
                                sx={{
                                    borderRadius: 6,
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                {isAuthenticated ? "Start Exploring" : "Sign In to Explore"}
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Footer with auth state indicator */}
                <Box sx={{
                    py: 3,
                    bgcolor: "background.paper",
                    borderTop: "1px solid rgba(0,0,0,0.06)"
                }}>
                    <Container maxWidth="xl">
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    © {new Date().getFullYear()} Metaphysical Studio. All rights reserved.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                                {isAuthenticated ? (
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Logged in as User
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<LogoutIcon fontSize="small" />}
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 1 }}>
                                        <Button
                                            size="small"
                                            onClick={goToSignup}
                                        >
                                            Sign Up
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<LoginIcon fontSize="small" />}
                                            onClick={goToLogin}
                                            sx={{ borderRadius: 4 }}
                                        >
                                            Login
                                        </Button>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;