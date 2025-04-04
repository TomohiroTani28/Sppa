// src/styles/theme.ts
// Theme configuration for the application
export const theme = {
  colors: {
    primary: '#007aff',
    secondary: '#38b2ac',
    background: '#f8f8f8',
    text: '#333333',
    muted: '#718096',
    white: '#ffffff',
    gray: '#e2e8f0',
    success: '#38a169',
    error: '#e53e3e',
    warning: '#f6ad55',
  },
  typography: {
    heading: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: '3rem',
    },
    body: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: '1.25rem',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
    xlarge: '4rem',
  },
  borderRadius: {
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem',
  },
  shadows: {
    light: '0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    heavy: '0 10px 15px rgba(0, 0, 0, 0.2)',
  },
};
