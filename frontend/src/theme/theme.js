import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === 'light' ? '#000000' : '#ffffff',
        contrastText: mode === 'light' ? '#ffffff' : '#000000',
      },
      secondary: {
        main: '#666666',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#000000',
        paper: mode === 'light' ? '#fcfcfc' : '#0a0a0a',
        surface: mode === 'light' ? '#f4f4f5' : '#18181b',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
        secondary: mode === 'light' ? '#52525b' : '#a1a1aa',
      },
      divider: mode === 'light' ? '#e4e4e7' : '#27272a',
    },
    typography: {
      fontFamily: [
        'Inter',
        'Outfit',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.021em',
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.018em',
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.975rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            padding: '8px 16px',
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: mode === 'light' ? '#000000' : '#ffffff',
            color: mode === 'light' ? '#ffffff' : '#000000',
            border: `1px solid ${mode === 'light' ? '#000000' : '#ffffff'}`,
            '&:hover': {
              backgroundColor: mode === 'light' ? '#1f1f1f' : '#e4e4e7',
            },
          },
          outlinedPrimary: {
            borderColor: mode === 'light' ? '#e4e4e7' : '#27272a',
            color: mode === 'light' ? '#000000' : '#ffffff',
            '&:hover': {
              borderColor: mode === 'light' ? '#000000' : '#ffffff',
              backgroundColor: mode === 'light' ? '#f4f4f5' : '#18181b',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#e4e4e7' : '#27272a',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#a1a1aa' : '#52525b',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#000000' : '#ffffff',
              borderWidth: '1.5px',
            },
          },
          input: {
            padding: '12px 14px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            border: `1px solid ${mode === 'light' ? '#e4e4e7' : '#27272a'}`,
            backgroundImage: 'none',
            boxShadow: 'none',
            backgroundColor: mode === 'light' ? '#ffffff' : '#09090b',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: mode === 'light' ? '#f4f4f5' : '#18181b',
              color: mode === 'light' ? '#000000' : '#ffffff',
              borderBottom: `1px solid ${mode === 'light' ? '#e4e4e7' : '#27272a'}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'light' ? '#f4f4f5' : '#18181b'}`,
            padding: '14px 16px',
          },
        },
      },
    },
  });
};
