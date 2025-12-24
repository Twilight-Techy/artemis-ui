/**
 * Artemis Color System
 * Purple-first identity with electric blue as secondary
 */

// Base palette - raw color values
export const palette = {
    // Primary Purple spectrum
    purple: {
        900: '#0D0815', // Near-black purple (darkest backgrounds)
        800: '#1A1025', // Deep cosmic purple
        700: '#2D1B4E', // Rich purple
        600: '#4A2C7A', // Vibrant purple
        500: '#6B3FA0', // Primary purple
        400: '#8B5CC7', // Lighter purple
        300: '#AB7EE0', // Soft purple
        200: '#CBB0F0', // Pale purple
        100: '#E8D6FA', // Very light purple
        50: '#F5EDFD',  // Almost white purple
    },

    // Secondary Electric Blue spectrum
    blue: {
        900: '#041525',
        800: '#0A2A4A',
        700: '#0F4070',
        600: '#1456A0',
        500: '#2B7DE9', // Electric blue - primary accent
        400: '#5A9EF7',
        300: '#8BBFFA',
        200: '#B8D8FC',
        100: '#E1F0FE',
        50: '#F3F9FF',
    },

    // Lavender - for highlights and text
    lavender: {
        500: '#A78BFA',
        400: '#C4B5FD',
        300: '#DDD6FE',
        200: '#EDE9FE',
        100: '#F5F3FF',
    },

    // Neutrals with purple tint
    neutral: {
        900: '#0F0E12', // Near black
        800: '#1C1A22',
        700: '#2A2833',
        600: '#3D3A47',
        500: '#52505E',
        400: '#706D7F',
        300: '#9794A3',
        200: '#C4C2CC',
        100: '#E5E4E9',
        50: '#F5F4F7',
    },

    // Semantic colors
    success: {
        500: '#06D6A0', // Cool cyan-green
        400: '#34E7B9',
        100: '#D5FAF0',
    },
    warning: {
        500: '#F59E0B', // Warm amber
        400: '#FBBF24',
        100: '#FEF3C7',
    },
    error: {
        500: '#EF4444', // Muted red
        400: '#F87171',
        300: '#FCA5A5',
        100: '#FEE2E2',
    },

    // Pure values
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
} as const;

// Semantic color tokens for dark theme
export const darkColors = {
    // Backgrounds
    background: {
        primary: palette.purple[900],    // Main app background
        secondary: palette.purple[800],  // Cards, modals
        tertiary: palette.purple[700],   // Elevated surfaces
        glass: 'rgba(45, 27, 78, 0.6)',  // Glassmorphism
        overlay: 'rgba(13, 8, 21, 0.85)', // Modal overlays
    },

    // Text
    text: {
        primary: '#F8F6FB',              // Main text (off-white, slightly warm)
        secondary: palette.lavender[300], // Secondary text
        tertiary: palette.neutral[400],  // Muted text
        inverse: palette.purple[900],    // Text on light surfaces
        accent: palette.blue[500],       // Links, highlighted text
    },

    // Accent colors
    accent: {
        primary: palette.purple[500],    // Primary brand color
        secondary: palette.blue[500],    // Electric blue accent
        tertiary: palette.lavender[500], // Soft accent
    },

    // Glow colors (for animations)
    glow: {
        primary: palette.purple[500],
        secondary: palette.blue[500],
        soft: palette.purple[400],
        bright: palette.blue[400],
    },

    // Semantic
    status: {
        success: palette.success[500],
        warning: palette.warning[500],
        error: palette.error[400],
        info: palette.blue[500],
    },

    // Borders
    border: {
        subtle: 'rgba(167, 139, 250, 0.1)',  // Very subtle borders
        default: 'rgba(167, 139, 250, 0.2)', // Normal borders
        strong: 'rgba(167, 139, 250, 0.4)',  // Emphasized borders
        accent: palette.blue[500],            // Highlighted borders
    },

    // Interactive states
    interactive: {
        idle: palette.purple[600],
        hover: palette.purple[500],
        active: palette.purple[400],
        disabled: palette.neutral[600],
    },

    // Gradient definitions
    gradient: {
        primary: [palette.purple[800], palette.purple[900]] as const,
        accent: [palette.purple[600], palette.blue[600]] as const,
        orb: [palette.purple[500], palette.blue[500]] as const,
    },
} as const;

// Semantic color tokens for light theme
export const lightColors = {
    // Backgrounds
    background: {
        primary: '#FAFAFC',              // Main app background
        secondary: palette.white,        // Cards, modals
        tertiary: palette.purple[50],    // Elevated surfaces
        glass: 'rgba(255, 255, 255, 0.8)', // Glassmorphism
        overlay: 'rgba(255, 255, 255, 0.9)', // Modal overlays
    },

    // Text
    text: {
        primary: palette.purple[900],
        secondary: palette.neutral[600],
        tertiary: palette.neutral[400],
        inverse: '#F8F6FB',
        accent: palette.blue[600],
    },

    // Accent colors
    accent: {
        primary: palette.purple[600],
        secondary: palette.blue[500],
        tertiary: palette.lavender[500],
    },

    // Glow colors (reduced intensity for light mode)
    glow: {
        primary: palette.purple[400],
        secondary: palette.blue[400],
        soft: palette.purple[300],
        bright: palette.blue[300],
    },

    // Semantic
    status: {
        success: palette.success[500],
        warning: palette.warning[500],
        error: palette.error[500],
        info: palette.blue[600],
    },

    // Borders
    border: {
        subtle: palette.neutral[100],
        default: palette.neutral[200],
        strong: palette.neutral[300],
        accent: palette.purple[500],
    },

    // Interactive states
    interactive: {
        idle: palette.purple[100],
        hover: palette.purple[200],
        active: palette.purple[300],
        disabled: palette.neutral[200],
    },

    // Gradient definitions
    gradient: {
        primary: [palette.purple[50], palette.white] as const,
        accent: [palette.purple[100], palette.blue[100]] as const,
        orb: [palette.purple[400], palette.blue[400]] as const,
    },
} as const;

// Color theme interface - structural type that both dark and light themes satisfy
export interface ColorTheme {
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
        glass: string;
        overlay: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        accent: string;
    };
    accent: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    glow: {
        primary: string;
        secondary: string;
        soft: string;
        bright: string;
    };
    status: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    border: {
        subtle: string;
        default: string;
        strong: string;
        accent: string;
    };
    interactive: {
        idle: string;
        hover: string;
        active: string;
        disabled: string;
    };
    gradient: {
        primary: readonly [string, string];
        accent: readonly [string, string];
        orb: readonly [string, string];
    };
}
