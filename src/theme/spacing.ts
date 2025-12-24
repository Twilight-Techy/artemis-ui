/**
 * Artemis Spacing & Layout System
 * Consistent spacing scale for margins, padding, gaps, and sizing
 */

// Base spacing scale (in pixels)
// Using a modified 4px base with expanded range for flexibility
export const spacing = {
    0: 0,
    px: 1,      // Hairline borders
    0.5: 2,     // Micro spacing
    1: 4,       // Minimal spacing
    1.5: 6,     // Tight elements
    2: 8,       // Small gaps
    2.5: 10,    // Compact elements
    3: 12,      // Standard small
    4: 16,      // Default spacing
    5: 20,      // Comfortable spacing
    6: 24,      // Standard medium
    7: 28,      // Medium-large
    8: 32,      // Large spacing
    9: 36,      // Extra spacing
    10: 40,     // Section gaps
    12: 48,     // Large sections
    14: 56,     // Extra large
    16: 64,     // Maximum standard
    20: 80,     // Hero spacing
    24: 96,     // Display spacing
    32: 128,    // Ultra spacing
} as const;

// Border radius scale
export const borderRadius = {
    none: 0,
    xs: 4,      // Subtle rounding
    sm: 8,      // Small elements (tags, chips)
    md: 12,     // Medium elements (buttons, inputs)
    lg: 16,     // Large elements (cards)
    xl: 20,     // Extra large
    '2xl': 24,  // Very rounded (modals)
    '3xl': 32,  // Pill-like
    full: 9999, // Perfect circles
} as const;

// Sizing for common elements
export const sizes = {
    // Icon sizes
    icon: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 32,
        xl: 40,
        '2xl': 48,
    },

    // Avatar sizes
    avatar: {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 56,
        xl: 72,
        '2xl': 96,
    },

    // Button heights
    button: {
        sm: 32,
        md: 44,
        lg: 52,
        xl: 60,
    },

    // Input heights
    input: {
        sm: 36,
        md: 48,
        lg: 56,
    },

    // Touch target minimum (accessibility)
    touchTarget: 44,

    // Orb sizes
    orb: {
        sm: 80,
        md: 120,
        lg: 180,
        xl: 240,
    },

    // Card widths/heights
    card: {
        minWidth: 280,
        maxWidth: 400,
        compactHeight: 80,
        standardHeight: 120,
        expandedHeight: 200,
    },
} as const;

// Safe area insets defaults (will be overridden by actual device values)
export const safeArea = {
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
} as const;

// Layout helpers
export const layout = {
    // Screen padding defaults
    screenPaddingHorizontal: spacing[4],
    screenPaddingVertical: spacing[4],

    // Content max widths
    contentMaxWidth: 500,
    wideContentMaxWidth: 700,

    // Tab bar height
    tabBarHeight: 60,

    // Header heights
    headerHeight: 56,
    headerHeightLarge: 96,

    // Bottom sheet snap points
    bottomSheet: {
        collapsed: 80,
        half: '50%',
        expanded: '90%',
    },
} as const;

// Z-index scale for layering
export const zIndex = {
    behind: -1,
    base: 0,
    raised: 1,
    dropdown: 10,
    sticky: 50,
    overlay: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
    toast: 500,
    max: 9999,
} as const;

// Animation timing (in milliseconds)
export const timing = {
    // Micro interactions
    instant: 50,
    fast: 150,
    normal: 250,
    slow: 400,

    // State changes
    stateChange: 300,
    pageTransition: 450,

    // Large transitions
    modalEnter: 350,
    modalExit: 250,

    // Orb animations
    orbPulse: 2000,
    orbThink: 1500,
    orbBurst: 500,

    // Waveform
    waveformUpdate: 100,
} as const;

// Shadow definitions
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
    // Glowing shadows for Artemis
    glow: {
        sm: {
            shadowColor: '#6B3FA0',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
        },
        md: {
            shadowColor: '#6B3FA0',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 8,
        },
        lg: {
            shadowColor: '#6B3FA0',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 32,
            elevation: 12,
        },
    },
} as const;
