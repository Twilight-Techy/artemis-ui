import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/src/theme';

// Prevent splash screen from hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

// Font loading configuration
const fontAssets = {
  // Sora fonts
  'Sora-Thin': require('../assets/fonts/Sora-Thin.ttf'),
  'Sora-Light': require('../assets/fonts/Sora-Light.ttf'),
  'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
  'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
  'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
  'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
  'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),

  // Inter fonts
  'Inter-Thin': require('../assets/fonts/Inter-Thin.ttf'),
  'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
  'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  'Inter-ExtraBold': require('../assets/fonts/Inter-ExtraBold.ttf'),

  // JetBrains Mono fonts
  'JetBrainsMono-Thin': require('../assets/fonts/JetBrainsMono-Thin.ttf'),
  'JetBrainsMono-Light': require('../assets/fonts/JetBrainsMono-Light.ttf'),
  'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
  'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  'JetBrainsMono-SemiBold': require('../assets/fonts/JetBrainsMono-SemiBold.ttf'),
  'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
  'JetBrainsMono-ExtraBold': require('../assets/fonts/JetBrainsMono-ExtraBold.ttf'),

  // Space Grotesk fonts
  'SpaceGrotesk-Light': require('../assets/fonts/SpaceGrotesk-Light.ttf'),
  'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
  'SpaceGrotesk-SemiBold': require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
  'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
};

export const unstable_settings = {
  anchor: '(tabs)',
};

// Inner layout that has access to theme context
function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(fontAssets);
        setFontsLoaded(true);
      } catch (error) {
        setFontError(error as Error);
        console.error('Error loading fonts:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider initialMode="dark">
      <RootLayoutNav />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
