/**
 * Artemis Theme Provider
 * Provides theme context for dark/light mode with all design tokens
 */

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, StatusBar, useColorScheme as useSystemColorScheme } from 'react-native';
import { darkColors, lightColors, type ColorTheme } from './colors';
import { borderRadius, layout, shadows, sizes, spacing, timing, zIndex } from './spacing';
import { fontFamilies, fontSizes, letterSpacing, lineHeights, textStyles } from './typography';

// Theme mode type
export type ThemeMode = 'light' | 'dark' | 'system';

// Full theme object type
export interface Theme {
    mode: 'light' | 'dark';
    colors: ColorTheme;
    typography: {
        styles: typeof textStyles;
        fonts: typeof fontFamilies;
        sizes: typeof fontSizes;
        lineHeights: typeof lineHeights;
        letterSpacing: typeof letterSpacing;
    };
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    sizes: typeof sizes;
    layout: typeof layout;
    timing: typeof timing;
    shadows: typeof shadows;
    zIndex: typeof zIndex;
    isDark: boolean;
}

// Theme context type
interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Build complete theme object
const buildTheme = (mode: 'light' | 'dark'): Theme => ({
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    typography: {
        styles: textStyles,
        fonts: fontFamilies,
        sizes: fontSizes,
        lineHeights: lineHeights,
        letterSpacing: letterSpacing,
    },
    spacing,
    borderRadius,
    sizes,
    layout,
    timing,
    shadows,
    zIndex,
    isDark: mode === 'dark',
});

// Provider props
interface ThemeProviderProps {
    children: ReactNode;
    initialMode?: ThemeMode;
}

/**
 * ThemeProvider Component
 * Wraps the app to provide theme context
 */
export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps) {
    const systemColorScheme = useSystemColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

    // Determine the actual mode based on preference
    const resolvedMode: 'light' | 'dark' = useMemo(() => {
        if (themeMode === 'system') {
            return systemColorScheme === 'light' ? 'light' : 'dark';
        }
        return themeMode;
    }, [themeMode, systemColorScheme]);

    // Build the theme object
    const theme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

    // Toggle between light and dark (skips system)
    const toggleTheme = useCallback(() => {
        setThemeMode((current) => {
            if (current === 'system') {
                // When in system mode, toggle to opposite of current resolved
                return resolvedMode === 'dark' ? 'light' : 'dark';
            }
            return current === 'dark' ? 'light' : 'dark';
        });
    }, [resolvedMode]);

    // Update status bar style based on theme
    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(theme.colors.background.primary);
        }
        StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content');
    }, [theme]);

    const contextValue = useMemo(
        () => ({
            theme,
            themeMode,
            setThemeMode,
            toggleTheme,
        }),
        [theme, themeMode, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme Hook
 * Access the theme and theme controls from any component
 */
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

/**
 * useColors Hook
 * Quick access to just the colors
 */
export function useColors(): ColorTheme {
    const { theme } = useTheme();
    return theme.colors;
}

/**
 * useTypography Hook
 * Quick access to typography utilities
 */
export function useTypography() {
    const { theme } = useTheme();
    return theme.typography;
}

/**
 * useIsDark Hook
 * Simple boolean check for dark mode
 */
export function useIsDark(): boolean {
    const { theme } = useTheme();
    return theme.isDark;
}

export default ThemeProvider;
