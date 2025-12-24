/**
 * Artemis Theme System
 * Central export for all theme-related modules
 */

// Color system
export {
    darkColors,
    lightColors, palette, type ColorTheme
} from './colors';

// Typography system
export {
    fontFamilies,
    fontSizes, letterSpacing, lineHeights, textStyles,
    type TextStyle
} from './typography';

// Spacing and layout system
export {
    borderRadius, layout, safeArea, shadows, sizes, spacing, timing, zIndex
} from './spacing';

// Theme provider and hooks
export {
    ThemeProvider, useColors, useIsDark, useTheme, useTypography, type Theme,
    type ThemeMode
} from './ThemeProvider';

