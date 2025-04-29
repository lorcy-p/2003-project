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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import theme from "../components/Theme";
import characters from "../data/characters";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Featured characters data - matches your SelectAI screen format
const featuredCharacters = characters;

const HomePage = () => {
    const navigate = useNavigate();

    // Refs for GSAP animations
    const headerRef = useRef(null);
    const heroRef = useRef(null);
    const charactersRef = useRef(null);
    const featuresRef = useRef(null);
    const searchRef = useRef(null);

    // Navigate to character selection
    const goToSelectAI = () => {
        navigate("/characters");
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scroll smooth
        });
    };

    // Navigate to specific character
    const startWithCharacter = (characterId: number) => {
        localStorage.setItem('AI_ID', characterId.toString());
        navigate('/chat');
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
        tl.fromTo(
            searchRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
            "-=0.2"
        );

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
                        <Box>
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

                        {/* Search bar */}
                        <Box ref={searchRef}>
                            <TextField
                                placeholder="Search characters..."
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: { xs: "100%", sm: 240 },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 8
                                    }
                                }}
                            />
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
                                        Explore Characters
                                    </Button>
                                </Box>
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
                                                    label="8 available"
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
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

                        <Grid container spacing={3} ref={charactersRef}>
                            {featuredCharacters.map((character) => (
                                <Grid item xs={12} sm={6} md={4} key={character.id}>
                                    <Card
                                        className="character-card"
                                        onClick={() => startWithCharacter(character.id)}
                                        sx={{
                                            cursor: "pointer",
                                            height: "100%",
                                            transition: "all 0.2s ease",
                                            border: "1px solid rgba(0,0,0,0.04)",
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                                boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height={180}
                                            image={character.imagePath}
                                            alt={character.name}
                                        />
                                        <CardContent sx={{ p: 2.5 }}>
                                            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                                                {character.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
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
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
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
                                endIcon={<ChevronRightIcon />}
                                onClick={goToSelectAI}
                                sx={{
                                    borderRadius: 6,
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                Start Exploring
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;