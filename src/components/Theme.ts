import { createTheme } from "@mui/material/styles";

// Central theme configuration for consistent styling across the application
const theme = createTheme({
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
            letterSpacing: "-0.025em"
        },
        h2: {
            fontWeight: 700,
            letterSpacing: "-0.025em"
        },
        h5: {
            fontWeight: 600,
            letterSpacing: "-0.015em"
        },
        h6: {
            fontWeight: 600,
            letterSpacing: "-0.01em"
        },
        button: {
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "10px 20px",
                    boxShadow: "none"
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
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    minHeight: 48
                }
            }
        }
    }
});

export default theme;