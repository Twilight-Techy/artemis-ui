/**
 * Artemis Typography System
 * Sora (headings) + Inter (body) + JetBrains Mono (code)
 */

// Font family definitions
export const fontFamilies = {
    // Primary - Sora (headings, assistant messages, important text)
    heading: {
        thin: 'Sora-Thin',
        light: 'Sora-Light',
        regular: 'Sora-Regular',
        medium: 'Sora-Medium',
        semiBold: 'Sora-SemiBold',
        bold: 'Sora-Bold',
        extraBold: 'Sora-ExtraBold',
    },

    // Secondary - Inter (body text, user messages, settings)
    body: {
        thin: 'Inter-Thin',
        light: 'Inter-Light',
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semiBold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
        extraBold: 'Inter-ExtraBold',
    },

    // Accent - JetBrains Mono (code, MCP reasoning, automations)
    mono: {
        thin: 'JetBrainsMono-Thin',
        light: 'JetBrainsMono-Light',
        regular: 'JetBrainsMono-Regular',
        medium: 'JetBrainsMono-Medium',
        semiBold: 'JetBrainsMono-SemiBold',
        bold: 'JetBrainsMono-Bold',
        extraBold: 'JetBrainsMono-ExtraBold',
    },

    // Optional - Space Grotesk (alternative display font)
    display: {
        light: 'SpaceGrotesk-Light',
        regular: 'SpaceGrotesk-Regular',
        medium: 'SpaceGrotesk-Medium',
        semiBold: 'SpaceGrotesk-SemiBold',
        bold: 'SpaceGrotesk-Bold',
    },
} as const;

// Font size scale (in pixels, will be used with responsive scaling)
export const fontSizes = {
    xs: 11,    // Small labels, timestamps
    sm: 13,    // Secondary text, captions
    base: 15,  // Body text default
    md: 17,    // Emphasized body text
    lg: 20,    // Small headings, card titles
    xl: 24,    // Section headings
    '2xl': 28, // Screen titles
    '3xl': 32, // Hero text
    '4xl': 40, // Large display text
    '5xl': 48, // Extra large display
} as const;

// Line height multipliers
export const lineHeights = {
    tight: 1.2,    // Headings
    snug: 1.35,    // Short text blocks
    normal: 1.5,   // Body text
    relaxed: 1.65, // Long-form reading
    loose: 1.8,    // Maximum readability
} as const;

// Letter spacing (tracking)
export const letterSpacing = {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
} as const;

// Pre-composed text styles for consistent usage
export const textStyles = {
    // Display styles (Sora)
    displayLarge: {
        fontFamily: fontFamilies.heading.bold,
        fontSize: fontSizes['4xl'],
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
    },
    displayMedium: {
        fontFamily: fontFamilies.heading.semiBold,
        fontSize: fontSizes['3xl'],
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
    },
    displaySmall: {
        fontFamily: fontFamilies.heading.semiBold,
        fontSize: fontSizes['2xl'],
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.normal,
    },

    // Heading styles (Sora)
    h1: {
        fontFamily: fontFamilies.heading.bold,
        fontSize: fontSizes['2xl'],
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.normal,
    },
    h2: {
        fontFamily: fontFamilies.heading.semiBold,
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.normal,
    },
    h3: {
        fontFamily: fontFamilies.heading.medium,
        fontSize: fontSizes.lg,
        lineHeight: lineHeights.snug,
        letterSpacing: letterSpacing.normal,
    },
    h4: {
        fontFamily: fontFamilies.heading.medium,
        fontSize: fontSizes.md,
        lineHeight: lineHeights.snug,
        letterSpacing: letterSpacing.normal,
    },

    // Body styles (Inter)
    bodyLarge: {
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.md,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    body: {
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    bodySmall: {
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },

    // Caption and label styles (Inter)
    caption: {
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.snug,
        letterSpacing: letterSpacing.wide,
    },
    label: {
        fontFamily: fontFamilies.body.medium,
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },
    labelSmall: {
        fontFamily: fontFamilies.body.medium,
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wider,
    },

    // Button text (Sora for primary CTAs, Inter for secondary)
    buttonLarge: {
        fontFamily: fontFamilies.heading.semiBold,
        fontSize: fontSizes.md,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },
    button: {
        fontFamily: fontFamilies.heading.medium,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },
    buttonSmall: {
        fontFamily: fontFamilies.body.semiBold,
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },

    // Code and technical text (JetBrains Mono)
    code: {
        fontFamily: fontFamilies.mono.regular,
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
    codeSmall: {
        fontFamily: fontFamilies.mono.regular,
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },

    // Artemis-specific styles
    assistantMessage: {
        fontFamily: fontFamilies.heading.regular,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
    userMessage: {
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    timestamp: {
        fontFamily: fontFamilies.body.regular,
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },
} as const;

export type TextStyle = keyof typeof textStyles;
