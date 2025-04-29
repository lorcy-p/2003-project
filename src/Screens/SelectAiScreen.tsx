import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
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
import theme from "../components/Theme";
import characters from "../data/characters"


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
            {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
        </div>
    );
}

const SelectAI: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedAI, setSelectedAI] = useState<AICharacter | null>(null);
    const [tabValue, setTabValue] = useState(0);

    // Sample AI character data
    const aiCharacters = characters;

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
                flexDirection: "column"
            }}>
                <Container maxWidth="xl" sx={{ flex: 1, display: "flex", flexDirection: "column", py: 3 }}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3
                    }}>
                        <Link to={'/'}>
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
                        </Link>

                        {/* Search bar moved to header for better space utilization */}
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
                                width: { xs: "50%", sm: "40%", md: "30%" },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 8
                                },
                                zIndex: "2"
                            }}
                        />
                    </Box>

                    {/* Main content area with flexible height */}
                    <Box sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3
                    }}>
                        {/* Character grid - takes less space for more sleek look */}
                        <Box sx={{
                            width: { xs: "100%", md: "35%" },
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2
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
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                    borderRadius: "3px"
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                    borderRadius: "3px"
                                }
                            }}>
                                <Grid container spacing={2}>
                                    {filteredCharacters.map((character) => (
                                        <Grid item xs={12} sm={6} md={12} lg={6} key={character.id}>
                                            <CharacterCard
                                                selected={selectedAI?.id === character.id}
                                                onClick={() => handleSelectCharacter(character)}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="120"
                                                    image={character.imagePath}
                                                    alt={character.name}
                                                />
                                                <CardContent sx={{ p: 2, pb: "16px !important", flex: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom noWrap>
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
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                    >
                                                        {character.shortDescription}
                                                    </Typography>

                                                    {/* Small info pills */}
                                                    <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
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
                                                </CardContent>
                                            </CharacterCard>
                                        </Grid>
                                    ))}
                                </Grid>

                                {filteredCharacters.length === 0 && (
                                    <Box sx={{
                                        p: 4,
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
                            width: { xs: "100%", md: "65%" },
                            display: "flex"
                        }}>
                            {selectedAI ? (
                                <DetailCard sx={{ width: "100%" }}>
                                    {/* Character header with image */}
                                    <Box sx={{
                                        display: "flex",
                                        p: { xs: 2, md: 3 },
                                        gap: 3,
                                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                                        flexDirection: { xs: "column", sm: "row" },
                                        alignItems: { xs: "center", sm: "flex-start" }
                                    }}>
                                        <Box
                                            component="img"
                                            src={selectedAI.imagePath}
                                            alt={selectedAI.name}
                                            sx={{
                                                width: { xs: "100%", sm: 120 },
                                                height: { xs: 200, sm: 120 },
                                                objectFit: "cover",
                                                borderRadius: 1.5,
                                                flexShrink: 0
                                            }}
                                        />

                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                flexDirection: { xs: "column", md: "row" },
                                                gap: { xs: 1, md: 0 }
                                            }}>
                                                <Typography variant="h5" component="h2" fontWeight="bold">
                                                    {selectedAI.name}
                                                </Typography>

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<ChatIcon />}
                                                    onClick={beginChatting}
                                                    sx={{
                                                        borderRadius: 6,
                                                        px: 2
                                                    }}
                                                >
                                                    Start Conversation
                                                </Button>
                                            </Box>

                                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                                {selectedAI.shortDescription}
                                            </Typography>

                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                        <StyledTabs
                                            value={tabValue}
                                            onChange={handleTabChange}
                                            aria-label="character details tabs"
                                            variant="fullWidth"
                                        >
                                            <Tab
                                                icon={<PersonIcon />}
                                                label="About"
                                                id="character-tab-0"
                                                aria-controls="character-tabpanel-0"
                                                iconPosition="start"
                                            />
                                            <Tab
                                                icon={<HistoryEduIcon />}
                                                label="Background"
                                                id="character-tab-1"
                                                aria-controls="character-tabpanel-1"
                                                iconPosition="start"
                                            />
                                            <Tab
                                                icon={<LocationOnIcon />}
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
                                            overflow: "hidden"
                                        }}>
                                            {/* About Tab */}
                                            <TabPanel value={tabValue} index={0}>
                                                <Typography variant="h6" gutterBottom>Profile</Typography>

                                                <Typography variant="body1" paragraph>
                                                    {selectedAI.fullDescription}
                                                </Typography>

                                                <Typography variant="body1" paragraph>
                                                    {selectedAI.name} loves to share their knowledge and experiences with interested listeners. Their expertise has been developed over many years of practice and study.
                                                </Typography>

                                                <Box sx={{
                                                    bgcolor: "primary.light",
                                                    p: 2,
                                                    borderRadius: 2,
                                                    mt: 2,
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 2
                                                }}>
                                                    <ChatIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                                                    <Typography variant="body2" color="primary.dark">
                                                        <strong>Conversation Tip:</strong> Ask {selectedAI.name} about their daily routine and what aspects of their work they find most rewarding.
                                                    </Typography>
                                                </Box>
                                            </TabPanel>

                                            {/* Background Tab */}
                                            <TabPanel value={tabValue} index={1}>
                                                <Typography variant="h6" gutterBottom>Experience & History</Typography>

                                                <Typography variant="body1" paragraph>
                                                    {selectedAI.name} began their career at a young age, learning the traditional methods and techniques that have been passed down through generations.
                                                </Typography>

                                                <Typography variant="body1" paragraph>
                                                    With {selectedAI.age} years of life experience, they've seen many changes in their field and adapted their practices while maintaining respect for tradition.
                                                </Typography>

                                                <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 3 }}>
                                                    Topics of Expertise
                                                </Typography>

                                                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                                    {[
                                                        "Traditional techniques",
                                                        "Historical knowledge",
                                                        "Specialized tools",
                                                        "Regional variations"
                                                    ].map((topic, index) => (
                                                        <Grid item xs={12} sm={6} key={index}>
                                                            <Box sx={{
                                                                p: 1.5,
                                                                border: "1px solid rgba(0,0,0,0.08)",
                                                                borderRadius: 1.5,
                                                                bgcolor: "background.default"
                                                            }}>
                                                                <Typography variant="body2">{topic}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </TabPanel>

                                            {/* Location Tab */}
                                            <TabPanel value={tabValue} index={2}>
                                                <Typography variant="h6" gutterBottom>Life in {selectedAI.residence}</Typography>

                                                <Typography variant="body1" paragraph>
                                                    {selectedAI.name} has deep connections to {selectedAI.residence}, where their work is influenced by local traditions and community needs.
                                                </Typography>

                                                <Typography variant="body1" paragraph>
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
                                                            height: 200,
                                                            bgcolor: "background.default",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundImage: `url(/path-to-location-image-${selectedAI.residence.toLowerCase()}.jpg)`,
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center"
                                                        }}
                                                    >
                                                        <Typography color="text.secondary" sx={{ bgcolor: "rgba(255,255,255,0.8)", px: 2, py: 0.5, borderRadius: 1 }}>
                                                            {selectedAI.residence} Landscape
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TabPanel>
                                        </Box>
                                    </Box>
                                </DetailCard>
                            ) : (
                                <DetailCard sx={{ width: "100%", p: 0 }}>
                                    <div style={{display: "flex", justifyContent: "center", zIndex: '1'}}>
                                        <Box sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            p: { xs: 3, md: 4 },
                                            textAlign: "center",
                                            position: "fixed",
                                            top: 0,

                                        }}>
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: "50%",
                                                    backgroundColor: "primary.light",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mb: 3
                                                }}
                                            >
                                                <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />
                                            </Box>

                                            <Typography variant="h5" component="h2" fontWeight="bold" mb={1}>
                                                Welcome to Metaphysical Studio
                                            </Typography>

                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                                sx={{
                                                    maxWidth: 500,
                                                    mb: 4
                                                }}
                                            >
                                                Select a character from the left to begin an immersive conversation experience.
                                                Each character has unique knowledge and background to explore.
                                            </Typography>

                                            <Grid container spacing={2} sx={{ maxWidth: 600 }}>
                                                {[
                                                    {
                                                        icon: <PersonIcon />,
                                                        title: "Diverse Characters",
                                                        desc: "Explore a range of unique personalities"
                                                    },
                                                    {
                                                        icon: <ChatIcon />,
                                                        title: "Natural Conversations",
                                                        desc: "Engage in realistic dialogues"
                                                    },
                                                    {
                                                        icon: <HistoryEduIcon />,
                                                        title: "Authentic Knowledge",
                                                        desc: "Learn from detailed subject expertise"
                                                    },
                                                    {
                                                        icon: <LocationOnIcon />,
                                                        title: "Cultural Immersion",
                                                        desc: "Experience different perspectives"
                                                    }
                                                ].map((feature, index) => (
                                                    <Grid item xs={12} sm={6} key={index}>
                                                        <Box sx={{
                                                            p: 2,
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
                                                                mb: 1.5
                                                            }}>
                                                                {feature.icon}
                                                            </Box>
                                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                                {feature.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {feature.desc}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </div>
                                </DetailCard>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SelectAI;