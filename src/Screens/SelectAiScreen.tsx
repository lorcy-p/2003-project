import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import useMediaQuery from "@mui/material/useMediaQuery";

// Base theme 
const baseTheme = createTheme({
    palette: {
        primary: {
            main: "#3a5ad9",
            light: "#eef1fd",
            dark: "#2a41a2"
        },
        secondary: {
            main: "#64748b"
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff"
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b"
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: "-0.025em",
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)"
        },
        h2: {
            fontWeight: 700,
            letterSpacing: "-0.025em",
            fontSize: "clamp(1.3rem, 4vw, 2rem)"
        },
        h5: {
            fontWeight: 600,
            letterSpacing: "-0.015em",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)"
        },
        h6: {
            fontWeight: 600,
            letterSpacing: "-0.01em",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)"
        },
        button: {
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 12
    }
});

// full theme with component overrides
const theme = createTheme(baseTheme, {
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "8px 16px",
                    boxShadow: "none",
                    fontSize: "0.875rem",
                    [baseTheme.breakpoints.up('sm')]: {
                        padding: "10px 20px",
                        fontSize: "0.9375rem"
                    }
                },
                containedPrimary: {
                    "&:hover": {
                        boxShadow: "0 10px 25px -12px rgba(58, 90, 217, 0.6)"
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
                    borderRadius: 12
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    minHeight: 48,
                    padding: "8px 12px",
                    [baseTheme.breakpoints.up('sm')]: {
                        fontSize: "0.95rem",
                        padding: "12px 16px"
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        fontSize: '0.875rem',
                        [baseTheme.breakpoints.up('sm')]: {
                            fontSize: '0.9375rem'
                        }
                    }
                }
            }
        }
    }
});

// Styled components
const CharacterCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "selected"
})<{ selected?: boolean }>(({ theme, selected }) => ({
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: selected ? `2px solid ${theme.palette.primary.main}` : "1px solid rgba(0,0,0,0.04)",
    transform: selected ? "translateY(-4px)" : "none",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
    }
}));

const DetailCard = styled(Card)(({ theme }) => ({
    height: "100%",
    border: "1px solid rgba(0,0,0,0.04)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
}));

const StickyDetailCard = styled(DetailCard)(({ theme }) => ({
    position: 'sticky',
    top: theme.spacing(8),
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
        top: theme.spacing(12),
        height: 'calc(100vh - 96px)'
    }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    "& .MuiTabs-indicator": {
        height: 3,
        borderRadius: "3px 3px 0 0"
    }
}));

// Tab panel component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`character-tabpanel-${index}`}
            aria-labelledby={`character-tab-${index}`}
            {...other}
            style={{
                height: value === index ? "auto" : 0,
                overflow: "auto",
                flex: value === index ? 1 : 0
            }}
        >
            {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
        </div>
    );
}

const SelectAI: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedAI, setSelectedAI] = useState<AICharacter | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Sample AI character data
    const aiCharacters: AICharacter[] = [
        {
            id: 166,
            name: "Fred the pig farmer",
            shortDescription: "Pig farming expert from Cornwall",
            age: 32,
            gender: "Male",
            residence: "Cornwall",
            fullDescription: "Fred is a pig farmer by blood. His love for pig farming started at a very young age and it is all he had dedicated his life to. He can tell you anything you need to know about pigs.",
            imagePath: "/images/AI image.png"
        },
        {
            id: 173,
            name: "Wade Smith the blacksmith",
            shortDescription: "Traditional blacksmith from London",
            age: 48,
            gender: "Male",
            residence: "London",
            fullDescription: "Wade has been smithing since he was a young lad. His father made sure to teach him all the tricks he needs to make high quality products.",
            imagePath: "/images/AI image.png"
        },
        {
            id: 176,
            name: "Marshal Jones",
            shortDescription: "The towns local hero, always looking out for the good samaritans.",
            age: 31,
            gender: "Male",
            residence: "Kansas",
            fullDescription: "The sherif of an old western town. He’s worked is way up the ladder of law. After witnessing a robbery at a very young age he dedicated himself to protecting his town.",
            imagePath: "/images/AI image.png"
        },
        {
            id: 179,
            name: "Duncan Miller",
            shortDescription: "Many would call him a hero. He was always ready to save a life.",
            age: 20,
            gender: "Male",
            residence: "Portsmouth",
            fullDescription: "A world war field medic. They thought for England, saving countless lives across multiple battles. They can tell you all about their battle field experiences and saves.",
            imagePath: "/images/AI image.png"
        },
        {
            "id": 176,
            "name": "Sofia the Astronomer",
            "shortDescription": "Stargazer and cosmic philosopher from Cambridge",
            "age": 36,
            "gender": "Female",
            "residence": "Cambridge",
            "fullDescription": "Sofia has spent countless nights observing the stars, tracking celestial movements, and contemplating humanity's place in the universe. Her knowledge spans both modern astrophysics and ancient astronomical traditions. She's passionate about making complex cosmic concepts accessible to everyone.",
            "imagePath": "/images/AI image.png"
        },
            {
                "id": 177,
                "name": "Kiran the Spice Merchant",
                "shortDescription": "Exotic spice expert with knowledge of global trade routes",
                "age": 52,
                "gender": "Male",
                "residence": "Brighton",
                "fullDescription": "Kiran's family has been in the spice trade for generations. He travels the world sourcing the finest ingredients and has accumulated extensive knowledge about culinary traditions, medicinal properties of spices, and the historical spice routes that shaped global commerce and culture.",
                "imagePath": "/images/AI image.png"
            },
            {
                "id": 178,
                "name": "Brigid the Weaver",
                "shortDescription": "Master of traditional textile arts and folklore",
                "age": 67,
                "gender": "Female",
                "residence": "Welsh Countryside",
                "fullDescription": "Brigid learned weaving as a child and has preserved ancient techniques that were nearly lost to time. Her knowledge extends beyond textiles to include local folklore, natural dyes, and the cultural significance of patterns. Her stories connect modern visitors to age-old traditions.",
                "imagePath": "/images/AI image.png"
            },
            {
                "id": 179,
                "name": "Edwin the Beekeeper",
                "shortDescription": "Honey producer and bee behavior specialist",
                "age": 43,
                "gender": "Male",
                "residence": "Yorkshire",
                "fullDescription": "Edwin has dedicated his life to understanding the complex societies of bees. He maintains several apiaries using both traditional and modern methods. His passion for preservation extends to wildflower meadows and sustainable agriculture. He can discuss everything from colony behavior to mead-making traditions.",
                "imagePath": "/images/AI image.png"
            }
    ];

    // Filter characters based on search query
    const filteredCharacters = aiCharacters.filter(char =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle character selection
    const handleSelectCharacter = (character: AICharacter) => {
        setSelectedAI(character);
    };

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Begin chatting with selected character
    const beginChatting = () => {
        if (selectedAI) {
            localStorage.setItem('AI_ID', selectedAI.id.toString());
            navigate('/chat');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                backgroundColor: "background.default",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflowX: 'hidden', 
                width: '100vw' 
            }}>
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        flex: 1, 
                        display: "flex", 
                        flexDirection: "column", 
                        py: { xs: 2, sm: 3 },
                        px: { xs: 2, sm: 3 },
                        overflowX: 'hidden', 
                        width: '100%' 
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: { xs: 2, sm: 3 },
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        gap: isSmallScreen ? 2 : 0,
                        width: '100%',
                        overflowX: 'hidden' 
                    }}>
                        <Box sx={{ 
                            textAlign: isSmallScreen ? 'center' : 'left',
                            mb: isSmallScreen ? 1 : 0,
                            width: '100%'
                        }}>
                            <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
                                Metaphysical
                            </Typography>
                            <Box sx={{
                                height: 3,
                                width: 40,
                                bgcolor: "primary.main",
                                mt: 0.5,
                                mx: isSmallScreen ? 'auto' : 'inherit'
                            }} />
                            <Typography variant="subtitle1" color="text.secondary">
                                Studio
                            </Typography>
                        </Box>

                        {/* Search bar */}
                        <TextField
                            placeholder="Search characters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                width: isSmallScreen ? '100%' : (isMediumScreen ? '60%' : '40%'),
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 8
                                }
                            }}
                        />
                    </Box>

                    {/* Main content area with flexible height */}
                    <Box sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 2, sm: 3 },
                        width: '100%',
                        overflowX: 'hidden' 
                    }}>
                        {/* Character grid */}
                        <Box sx={{
                            width: { xs: "100%", md: "35%", lg: "30%" },
                            display: "flex",
                            flexDirection: "column",
                            overflowX: 'hidden' 
                        }}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                                width: '100%'
                            }}>
                                <Typography variant="h6">Characters</Typography>
                                <Chip
                                    label={`${filteredCharacters.length} available`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>

                            <Box sx={{
                                flex: 1,
                                overflowY: "auto",
                                pr: { xs: 0, md: 1 },
                                py: 0.5,
                                width: '100%',
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                    borderRadius: "3px"
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                    borderRadius: "3px"
                                }
                            }}>
                                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                    {filteredCharacters.map((character) => (
                                        <Grid item xs={12} sm={6} md={12} lg={6} key={character.id}>
                                            <CharacterCard
                                                selected={selectedAI?.id === character.id}
                                                onClick={() => handleSelectCharacter(character)}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height={isSmallScreen ? "140" : "120"}
                                                    image={character.imagePath}
                                                    alt={character.name}
                                                />
                                                <CardContent sx={{ 
                                                    p: { xs: 1.5, sm: 2 }, 
                                                    pb: "16px !important", 
                                                    flex: 1 
                                                }}>
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        fontWeight="medium" 
                                                        gutterBottom 
                                                        noWrap
                                                        sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
                                                    >
                                                        {character.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                                                        }}
                                                    >
                                                        {character.shortDescription}
                                                    </Typography>

                                                    {/* Small info pills */}
                                                    <Box sx={{ 
                                                        display: "flex", 
                                                        gap: 1, 
                                                        mt: 1.5, 
                                                        flexWrap: "wrap" 
                                                    }}>
                                                        <Chip
                                                            label={character.residence}
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: "0.7rem",
                                                                bgcolor: "background.default",
                                                                [theme.breakpoints.up('sm')]: {
                                                                    fontSize: "0.75rem"
                                                                }
                                                            }}
                                                        />
                                                        <Chip
                                                            label={`Age: ${character.age}`}
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: "0.7rem",
                                                                bgcolor: "background.default",
                                                                [theme.breakpoints.up('sm')]: {
                                                                    fontSize: "0.75rem"
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </CharacterCard>
                                        </Grid>
                                    ))}
                                </Grid>

                                {filteredCharacters.length === 0 && (
                                    <Box sx={{
                                        p: { xs: 3, sm: 4 },
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        bgcolor: "background.paper",
                                        borderRadius: 2,
                                        border: "1px dashed rgba(0,0,0,0.1)"
                                    }}>
                                        <SearchIcon color="disabled" sx={{ fontSize: 36, mb: 2, opacity: 0.6 }} />
                                        <Typography color="text.secondary" fontSize="0.9rem" textAlign="center">
                                            No characters found matching "{searchQuery}"
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Character details section */}
                        <Box sx={{
                            width: { xs: "100%", md: "65%", lg: "70%" },
                            display: "flex",
                            mt: { xs: selectedAI ? 0 : 2, md: 0 },
                            position: 'relative',
                            overflowX: 'hidden' 
                        }}>
                            {selectedAI ? (
                                <DetailCard sx={{ 
                                    width: "100%",
                                    overflowX: 'hidden' 
                                }}>
                                    {/* Character header with image */}
                                    <Box sx={{
                                        display: "flex",
                                        p: { xs: 2, sm: 3 },
                                        gap: { xs: 2, sm: 3 },
                                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                                        flexDirection: { xs: "column", sm: "row" },
                                        alignItems: { xs: "center", sm: "flex-start" },
                                        width: '100%'
                                    }}>
                                        <Box
                                            component="img"
                                            src={selectedAI.imagePath}
                                            alt={selectedAI.name}
                                            sx={{
                                                width: { xs: "100%", sm: 120, md: 140 },
                                                height: { xs: 180, sm: 120, md: 140 },
                                                objectFit: "cover",
                                                borderRadius: 1.5,
                                                flexShrink: 0
                                            }}
                                        />

                                        <Box sx={{ flex: 1, width: '100%' }}>
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                flexDirection: { xs: "column", sm: "row" },
                                                gap: { xs: 1, sm: 0 },
                                                mb: { xs: 1, sm: 0 }
                                            }}>
                                                <Typography variant="h5" component="h2" fontWeight="bold">
                                                    {selectedAI.name}
                                                </Typography>

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size={isSmallScreen ? "small" : "medium"}
                                                    startIcon={<ChatIcon />}
                                                    onClick={beginChatting}
                                                    sx={{
                                                        borderRadius: 6,
                                                        px: 2,
                                                        mt: { xs: 1, sm: 0 },
                                                        alignSelf: { xs: 'stretch', sm: 'flex-start' }
                                                    }}
                                                >
                                                    Start Conversation
                                                </Button>
                                            </Box>

                                            <Typography 
                                                variant="body1" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    mt: 1, 
                                                    mb: 2,
                                                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                                                }}
                                            >
                                                {selectedAI.shortDescription}
                                            </Typography>

                                            <Box sx={{ 
                                                display: "flex", 
                                                gap: 1, 
                                                flexWrap: "wrap",
                                                '& .MuiChip-root': {
                                                    fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                                                }
                                            }}>
                                                <Chip
                                                    icon={<PersonIcon fontSize="small" />}
                                                    label={`${selectedAI.age}, ${selectedAI.gender}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    icon={<LocationOnIcon fontSize="small" />}
                                                    label={selectedAI.residence}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Tabs section */}
                                    <Box sx={{ 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        flex: 1,
                                        overflowX: 'hidden' 
                                    }}>
                                        <StyledTabs
                                            value={tabValue}
                                            onChange={handleTabChange}
                                            aria-label="character details tabs"
                                            variant={isSmallScreen ? "scrollable" : "fullWidth"}
                                            scrollButtons={isSmallScreen ? "auto" : false}
                                        >
                                            <Tab
                                                icon={isSmallScreen ? <PersonIcon fontSize="small" /> : <PersonIcon />}
                                                label="About"
                                                id="character-tab-0"
                                                aria-controls="character-tabpanel-0"
                                                iconPosition="start"
                                            />
                                            <Tab
                                                icon={isSmallScreen ? <HistoryEduIcon fontSize="small" /> : <HistoryEduIcon />}
                                                label="Background"
                                                id="character-tab-1"
                                                aria-controls="character-tabpanel-1"
                                                iconPosition="start"
                                            />
                                            <Tab
                                                icon={isSmallScreen ? <LocationOnIcon fontSize="small" /> : <LocationOnIcon />}
                                                label="Location"
                                                id="character-tab-2"
                                                aria-controls="character-tabpanel-2"
                                                iconPosition="start"
                                            />
                                        </StyledTabs>

                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            flex: 1,
                                            overflow: "hidden",
                                            overflowX: 'hidden' 
                                        }}>
                                            {/* About Tab */}
                                            <TabPanel value={tabValue} index={0}>
                                                <Typography variant="h6" gutterBottom>Profile</Typography>

                                                <Typography 
                                                    variant="body1" 
                                                    paragraph
                                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                                                >
                                                    {selectedAI.fullDescription}
                                                </Typography>

                                                <Typography 
                                                    variant="body1" 
                                                    paragraph
                                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                                                >
                                                    {selectedAI.name} loves to share their knowledge and experiences with interested listeners. Their expertise has been developed over many years of practice and study.
                                                </Typography>

                                                <Box sx={{
                                                    bgcolor: "primary.light",
                                                    p: 2,
                                                    borderRadius: 2,
                                                    mt: 2,
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1
                                                }}>
                                                    <ChatIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                                                    <Typography 
                                                        variant="body2" 
                                                        color="primary.dark"
                                                        sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                                                    >
                                                        <strong>Conversation Tip:</strong> Ask {selectedAI.name} about their daily routine and what aspects of their work they find most rewarding.
                                                    </Typography>
                                                </Box>
                                            </TabPanel>

                                            {/* Background Tab */}
                                            <TabPanel value={tabValue} index={1}>
                                                <Typography variant="h6" gutterBottom>Experience & History</Typography>

                                                <Typography 
                                                    variant="body1" 
                                                    paragraph
                                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                                                >
                                                    {selectedAI.name} began their career at a young age, learning the traditional methods and techniques that have been passed down through generations.
                                                </Typography>

                                                <Typography 
                                                    variant="body1" 
                                                    paragraph
                                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                                                >
                                                    With {selectedAI.age} years of life experience, they've seen many changes in their field and adapted their practices while maintaining respect for tradition.
                                                </Typography>

                                                <Typography 
                                                    variant="subtitle1" 
                                                    fontWeight="medium" 
                                                    gutterBottom 
                                                    sx={{ 
                                                        mt: 3,
                                                        fontSize: { xs: '0.9375rem', sm: '1rem' }
                                                    }}
                                                >
                                                    Topics of Expertise
                                                </Typography>

                                                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mt: 0.5 }}>
                                                    {[
                                                        "Traditional techniques",
                                                        "Historical knowledge",
                                                        "Specialized tools",
                                                        "Regional variations"
                                                    ].map((topic, index) => (
                                                        <Grid item xs={12} sm={6} key={index}>
                                                            <Box sx={{
                                                                p: { xs: 1, sm: 1.5 },
                                                                border: "1px solid rgba(0,0,0,0.08)",
                                                                borderRadius: 1.5,
                                                                bgcolor: "background.default",
                                                                height: '100%'
                                                            }}>
                                                                <Typography 
                                                                    variant="body2"
                                                                    sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                                                                >
                                                                    {topic}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </TabPanel>

                                            {/* Location Tab */}
                                            <TabPanel value={tabValue} index={2}>
                                                <Typography variant="h6" gutterBottom>Life in {selectedAI.residence}</Typography>

                                                <Typography 
                                                    variant="body1" 
                                                    paragraph
                                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                                                >
                                                    {selectedAI.name} has deep connections to {selectedAI.residence}, where their work is influenced by local traditions and community needs.
                                                </Typography>

                                                <Typography 
                                                    variant="body1" 
                                                    paragraph
                                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem' } }}
                                                >
                                                    The unique environment and culture of {selectedAI.residence} have shaped their skills and perspective in countless ways.
                                                </Typography>

                                                <Box sx={{
                                                    mt: 3,
                                                    p: 0.5,
                                                    border: "1px solid rgba(0,0,0,0.08)",
                                                    borderRadius: 2,
                                                    overflow: "hidden"
                                                }}>
                                                    <Box
                                                        sx={{
                                                            height: { xs: 150, sm: 200 },
                                                            bgcolor: "background.default",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundImage: `url(/path-to-location-image-${selectedAI.residence.toLowerCase()}.jpg)`,
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center"
                                                        }}
                                                    >
                                                        <Typography 
                                                            color="text.secondary" 
                                                            sx={{ 
                                                                bgcolor: "rgba(255,255,255,0.8)", 
                                                                px: 2, 
                                                                py: 0.5, 
                                                                borderRadius: 1,
                                                                fontSize: { xs: '0.8125rem', sm: '0.875rem' }
                                                            }}
                                                        >
                                                            {selectedAI.residence} Landscape
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TabPanel>
                                        </Box>
                                    </Box>
                                </DetailCard>
                            ) : (
                                <StickyDetailCard sx={{ 
                                    width: "100%",
                                    overflowX: 'hidden' 
                                }}>
                                    <Box sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        p: { xs: 2, sm: 3, md: 4 },
                                        textAlign: "center",
                                        width: '100%'
                                    }}>
                                        <Box
                                            sx={{
                                                width: { xs: 60, sm: 80 },
                                                height: { xs: 60, sm: 80 },
                                                borderRadius: "50%",
                                                backgroundColor: "primary.light",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: { xs: 2, sm: 3 }
                                            }}
                                        >
                                            <PersonIcon sx={{ 
                                                fontSize: { xs: 30, sm: 40 }, 
                                                color: "primary.main" 
                                            }} />
                                        </Box>

                                        <Typography 
                                            variant="h5" 
                                            component="h2" 
                                            fontWeight="bold" 
                                            mb={1}
                                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                                        >
                                            Welcome to Metaphysical Studio
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{
                                                maxWidth: 500,
                                                mb: { xs: 3, sm: 4 },
                                                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                                            }}
                                        >
                                            Select a character from the left to begin an immersive conversation experience.
                                            Each character has unique knowledge and background to explore.
                                        </Typography>

                                        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ maxWidth: 600 }}>
                                            {[
                                                {
                                                    icon: <PersonIcon fontSize={isSmallScreen ? "small" : "medium"} />,
                                                    title: "Diverse Characters",
                                                    desc: "Explore a range of unique personalities"
                                                },
                                                {
                                                    icon: <ChatIcon fontSize={isSmallScreen ? "small" : "medium"} />,
                                                    title: "Natural Conversations",
                                                    desc: "Engage in realistic dialogues"
                                                },
                                                {
                                                    icon: <HistoryEduIcon fontSize={isSmallScreen ? "small" : "medium"} />,
                                                    title: "Authentic Knowledge",
                                                    desc: "Learn from detailed subject expertise"
                                                },
                                                {
                                                    icon: <LocationOnIcon fontSize={isSmallScreen ? "small" : "medium"} />,
                                                    title: "Cultural Immersion",
                                                    desc: "Experience different perspectives"
                                                }
                                            ].map((feature, index) => (
                                                <Grid item xs={12} sm={6} key={index}>
                                                    <Box sx={{
                                                        p: { xs: 1.5, sm: 2 },
                                                        border: "1px solid rgba(0,0,0,0.08)",
                                                        borderRadius: 2,
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        textAlign: "center"
                                                    }}>
                                                        <Box sx={{
                                                            color: "primary.main",
                                                            mb: { xs: 1, sm: 1.5 }
                                                        }}>
                                                            {feature.icon}
                                                        </Box>
                                                        <Typography 
                                                            variant="subtitle2" 
                                                            fontWeight="bold" 
                                                            gutterBottom
                                                            sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                                                        >
                                                            {feature.title}
                                                        </Typography>
                                                        <Typography 
                                                            variant="body2" 
                                                            color="text.secondary"
                                                            sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                                                        >
                                                            {feature.desc}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </StickyDetailCard>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SelectAI;